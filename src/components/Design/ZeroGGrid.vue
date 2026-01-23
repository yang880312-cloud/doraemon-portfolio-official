<script setup>
import { ref, onMounted, nextTick } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  items: Array,
})

const emit = defineEmits(['item-click'])

// 3D Magnetic Tilt Logic
const cardRefs = ref([])

onMounted(() => {
  // "Poker Deal" Animation
  nextTick(() => {
    // Ensure refs are populated
    if (cardRefs.value.length === 0) return

    // Animate from "Bottom Center Stack"
    gsap.from(cardRefs.value, {
      duration: 1.2,
      y: window.innerHeight, // Start from bottom of screen
      x: (index) => {
        // Simple randomization to make the stack look messy before flying out
        return (Math.random() - 0.5) * 200
      },
      scale: 0.2,
      rotation: () => Math.random() * 60 - 30, // Random rotation in stack
      opacity: 0,
      stagger: {
        amount: 0.8, // Total time to deal all cards
        from: "start"
      },
      ease: "back.out(1.2)", // "Springy" deal effect
      clearProps: "all" // Important: Clear transform so magnetic hover works afterwards
    })
  })
})

function handleMouseMove(e, index) {
  const card = cardRefs.value[index]
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  // Calculate rotation (max 12 degrees for visible but smooth effect)
  const rotateX = ((y - centerY) / centerY) * -12
  const rotateY = ((x - centerX) / centerX) * 12

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
}

function handleMouseLeave(index) {
  const card = cardRefs.value[index]
  if (!card) return

  card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
}

// Map layout keywords to Tailwind col/row spans + Aspect Ratios
// Defaulting to aspect-square to ensure 1:1 unless specified otherwise
function getSpanClass(layout) {
  switch (layout) {
    case 'wide': return 'col-span-2 row-span-1 aspect-[2/1]'
    case 'tall': return 'col-span-1 row-span-2 aspect-[1/2]'
    case 'big': return 'col-span-2 row-span-2 aspect-square'
    default: return 'col-span-1 row-span-1 aspect-square' // standard 1:1
  }
}
</script>

<template>
  <div class="w-full h-full overflow-y-auto custom-scrollbar p-8 md:p-16 pb-32">
    <!-- Zero-G Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 max-w-[1600px] mx-auto">

      <div
        v-for="(item, index) in items"
        :key="item.id"
        :ref="el => cardRefs[index] = el"
        @mousemove="(e) => handleMouseMove(e, index)"
        @mouseleave="handleMouseLeave(index)"
        @click="$emit('item-click', item)"
        class="relative group rounded-3xl cursor-none transition-all duration-300 ease-out preserve-3d"
        :class="getSpanClass(item.layout)"
      >
        <!-- Aura Glow (Behind) -->
        <div
            class="absolute -inset-2 rounded-[2.5rem] opacity-0 group-hover:opacity-70 blur-xl transition-opacity duration-500 will-change-opacity"
            :style="{ backgroundColor: item.theme_color || '#8b5cf6' }"
        ></div>

        <!-- Magnetic Card Body -->
        <div class="relative w-full h-full rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/10 group-hover:border-white/40 transition-colors z-10 box-border">

            <!-- Tech Corners (HUD Effect - Top Left) -->
            <div class="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/30 rounded-tl-sm z-20 group-hover:border-white/90 group-hover:w-6 group-hover:h-6 transition-all duration-300"></div>
            <!-- Tech Corners (HUD Effect - Bottom Right) -->
            <div class="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/30 rounded-br-sm z-20 group-hover:border-white/90 group-hover:w-6 group-hover:h-6 transition-all duration-300"></div>

            <!-- Project ID (Tech Label) -->
            <div class="absolute top-4 right-4 z-20 font-mono text-[9px] tracking-widest text-white/30 group-hover:text-white/80 transition-colors">
               ID-{{ (index + 1).toString().padStart(3, '0') }} // {{ item.layout?.toUpperCase() || 'STD' }}
            </div>

            <!-- Full Bleed Image -->
            <img
                :src="item.image"
                class="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                alt="Project Thumbnail"
            />

            <!-- Glass Overlay (Info Reveal) -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <!-- Theme Line -->
                <div class="w-12 h-0.5 mb-3" :style="{ backgroundColor: item.theme_color || '#fff' }"></div>

                <span
                    class="text-[9px] font-mono uppercase tracking-[0.2em] text-white/70 mb-1"
                >
                    {{ item.category || 'EXHIBIT' }}
                </span>
                <h3 class="text-xl md:text-2xl font-bold text-white leading-none tracking-tight">
                    {{ item.title }}
                </h3>
            </div>
        </div>

      </div>
    </div>

    <!-- Empty State -->
    <div v-if="items.length === 0" class="flex flex-col items-center justify-center py-20 text-white/20 font-mono">
       <div class="w-16 h-16 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center mb-4 animate-spin-slow">
         <span class="text-2xl">⚡</span>
       </div>
       <p class="tracking-[0.2em] text-xs uppercase">Sector Offline / No Data</p>
    </div>
  </div>
</template>

<style scoped>
.preserve-3d {
    transform-style: preserve-3d;
    backface-visibility: hidden;
    will-change: transform;
}

/* Hide Scrollbar but keep functionality */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #222;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #444;
}
</style>
