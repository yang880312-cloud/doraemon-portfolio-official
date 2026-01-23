<script setup>
import { ref, nextTick, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  items: Array,
})

const emit = defineEmits(['item-click', 'deal-start'])

// 3D Magnetic Tilt Logic
const cardRefs = ref([])
const isDealt = ref(false)

function dealCards() {
    isDealt.value = true
    emit('deal-start')

    nextTick(() => {
        if (cardRefs.value.length === 0) return

        // Calculate center of screen for "From" position
        // Since the deck is fixed center, we just use window center
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2

        gsap.fromTo(cardRefs.value,
            {
                // We want them to fly OUT from the center
                // But since they are in grid flow, we use x/y to offset them
                // This is a bit tricky with offsets.
                // Simpler: use set to fixed center, then to grid.
                // But getting their natural grid position is hard if they are fixed.
                // Strategy: Use 'from' logic. We assume they are at their final position (because opacity 1 in DOM),
                // and we animate 'from' the center.
                x: (i, target) => {
                    const rect = target.getBoundingClientRect()
                    return centerX - (rect.left + rect.width/2)
                },
                y: (i, target) => {
                    const rect = target.getBoundingClientRect()
                    return centerY - (rect.top + rect.height/2)
                },
                scale: 0.1,
                rotation: () => Math.random() * 180 - 90, // Crazy spin
                opacity: 0,
                z: -500
            },
            {
                duration: 0.8,
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                opacity: 1,
                z: 0,
                stagger: {
                    amount: 0.6,
                    grid: "auto",
                    from: "center"
                },
                ease: "power4.out",
                clearProps: "all"
            }
        )
    })
}

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
  <div class="relative w-full h-full overflow-y-auto custom-scrollbar p-8 md:p-16 pb-32">

    <!-- Interaction Layer: The Deck Stack -->
    <!-- Only visible if not dealt yet and we have items -->
    <div
      v-if="!isDealt && items.length > 0"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-700"
      @click="dealCards"
    >
        <!-- Title in Intro Screen -->
        <h1 class="mb-12 text-center opacity-0 animate-fade-in-up" style="animation-delay: 0.2s; animation-fill-mode: forwards;">
            <span class="block text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#00A0E9] to-[#0089C9] drop-shadow-[0_0_15px_rgba(0,160,233,0.6)] mb-4" style="font-family: 'Noto Sans TC', sans-serif;">
                繪世界藝廊
            </span>
            <span class="text-white/60 tracking-[0.5em] text-sm font-mono border-t border-white/20 pt-4 block mx-auto w-32">
                PAINTED WORLD
            </span>
        </h1>

        <div class="relative w-[300px] h-[450px] cursor-pointer group hover:scale-105 transition-transform duration-500 will-change-transform perspective-1000">
            <!-- Stack Effect Layers (Rotated cards behind) -->
            <div class="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-40 transform rotate-6 translate-y-4 transition-transform duration-500 group-hover:rotate-12 group-hover:translate-x-4" style="background-image: url('/src/assets/cyber-tarot-back.png');"></div>
            <div class="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-60 transform -rotate-3 translate-y-2 transition-transform duration-500 group-hover:-rotate-6 group-hover:-translate-x-4" style="background-image: url('/src/assets/cyber-tarot-back.png');"></div>

            <!-- Top Card (The Active Deck) -->
            <div class="absolute inset-0 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_80px_rgba(139,92,246,0.6)] transition-shadow duration-500 overflow-hidden border border-white/10 bg-[#0a0a0a]">
                <img src="/src/assets/cyber-tarot-back.png" alt="Deck" class="w-full h-full object-cover" />

                <!-- Overlay Text -->
                <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                     <!-- Floating 'Click' Hint -->
                     <button class="mt-32 px-8 py-3 bg-black/60 backdrop-blur-sm rounded-full border border-white/20 text-white/90 text-sm tracking-[0.3em] font-mono group-hover:bg-[#009EFF] group-hover:text-black group-hover:font-bold group-hover:border-[#009EFF] transition-all duration-300">
                        點擊發牌 // START
                     </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Zero-G Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 max-w-[1600px] mx-auto min-h-[50vh]">

      <div
        v-for="(item, index) in items"
        :key="item.id"
        :ref="el => cardRefs[index] = el"
        @mousemove="(e) => handleMouseMove(e, index)"
        @mouseleave="handleMouseLeave(index)"
        @click="$emit('item-click', item)"
        class="relative group rounded-3xl cursor-none transition-all duration-300 ease-out preserve-3d"
        :class="[getSpanClass(item.layout), isDealt ? 'opacity-100' : 'opacity-0']"
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

/* Scrollbar Hiding for immersive feel */
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
