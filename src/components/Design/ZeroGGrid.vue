<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  items: Array,
})

const emit = defineEmits(['item-click'])

// 3D Magnetic Tilt Logic
const cardRefs = ref([])

function handleMouseMove(e, index) {
  const card = cardRefs.value[index]
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left // cursor x relative to card
  const y = e.clientY - rect.top  // cursor y relative to card

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  // Calculate rotation (max 15 degrees)
  const rotateX = ((y - centerY) / centerY) * -10
  const rotateY = ((x - centerX) / centerX) * 10

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
}

function handleMouseLeave(index) {
  const card = cardRefs.value[index]
  if (!card) return

  card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
}

// Map layout keywords to Tailwind col/row spans
function getSpanClass(layout) {
  switch (layout) {
    case 'wide': return 'col-span-2 row-span-1'
    case 'tall': return 'col-span-1 row-span-2'
    case 'big': return 'col-span-2 row-span-2'
    default: return 'col-span-1 row-span-1' // standard
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
        class="relative group rounded-3xl cursor-none transition-all duration-200 ease-out preserve-3d"
        :class="getSpanClass(item.layout)"
      >
        <!-- Aura Glow (Behind) -->
        <div
            class="absolute -inset-4 rounded-[2rem] opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-500"
            :style="{ backgroundColor: item.theme_color || '#8b5cf6' }"
        ></div>

        <!-- Magnetic Card Body -->
        <div class="relative w-full h-full rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/5 shadow-2xl group-hover:border-white/20 transition-colors">
            <!-- Full Bleed Image -->
            <img
                :src="item.image"
                class="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                alt="Project Thumbnail"
            />

            <!-- Glass Overlay (Reveals on Hover) -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span
                    class="text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-2 py-1 rounded w-fit text-black"
                    :style="{ backgroundColor: item.theme_color || '#fff' }"
                >
                    {{ item.category || 'ART' }}
                </span>
                <h3 class="text-xl md:text-2xl font-black text-white leading-tight font-serif italic">
                    {{ item.title }}
                </h3>
            </div>
        </div>

      </div>
    </div>

    <!-- Empty State -->
    <div v-if="items.length === 0" class="flex flex-col items-center justify-center h-full text-white/20 font-mono">
       <div class="text-4xl mb-4">🌌</div>
       <p>No artifacts details found in this sector.</p>
    </div>
  </div>
</template>

<style scoped>
.preserve-3d {
    transform-style: preserve-3d;
    backface-visibility: hidden;
}

/* Hide Scrollbar but keep functionality */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
