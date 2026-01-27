<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { skills, fillers } from '@/data/lobbyKeywords'

const container = ref(null)
const words = ref([])
const mouse = { x: -1000, y: -1000 }

// Flatten word list
const skillPool = [...skills, ...skills] // Double weight for skills

function generateGrid() {
  if (!container.value) return

  const { clientWidth, clientHeight } = container.value
  const tempWords = []

  // 1. Texture Layer (High Density Fillers)
  // Grid size small for density
  const cols = Math.floor(clientWidth / 80)
  const rows = Math.floor(clientHeight / 40)

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() > 0.4) continue // 60% empty space to not over-clutter

      const text = fillers[Math.floor(Math.random() * fillers.length)]
      tempWords.push({
        id: `tex-${r}-${c}`,
        text,
        x: (c * 80) + (Math.random() * 40),
        y: (r * 40) + (Math.random() * 10),
        type: 'texture',
        fontSize: Math.random() > 0.8 ? 'text-xs' : 'text-[10px]', // Tiny
        opacity: 0.15,
        rotation: Math.random() > 0.95 ? 90 : 0 // Occasional vertical text
      })
    }
  }

  // 2. Hero Layer (Big Skills)
  // Random placement, not strict grid
  const heroCount = Math.floor((clientWidth * clientHeight) / 50000) // approx 1 per 500x500 area

  for (let i = 0; i < heroCount; i++) {
    const text = skillPool[Math.floor(Math.random() * skillPool.length)]
    tempWords.push({
      id: `hero-${i}`,
      text,
      x: Math.random() * (clientWidth - 100),
      y: Math.random() * (clientHeight - 50),
      type: 'hero',
      fontSize: ['text-4xl', 'text-5xl', 'text-6xl'][Math.floor(Math.random() * 3)], // HUGE
      opacity: 0.3, // Brighter base
      rotation: 0
    })
  }

  words.value = tempWords
}

function handleMouseMove(e) {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

onMounted(() => {
  generateGrid()
  window.addEventListener('resize', generateGrid)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('resize', generateGrid)
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div ref="container" class="absolute inset-0 overflow-hidden bg-[#050505] -z-10 select-none pointer-events-none">

    <!-- Shared rendering logic for both layers (Dims + Highlights) -->
    <!-- We iterate once in template but apply styles dynamically -->

    <!-- BASE LAYER (Dim) -->
    <div class="absolute inset-0 grid-layer">
        <span
            v-for="word in words"
            :key="'base-'+word.id"
            class="absolute font-mono tracking-tighter whitespace-nowrap leading-none transition-all duration-500"
            :class="[
                word.fontSize,
                word.type === 'hero' ? 'font-black text-[#222]' : 'text-[#111]'
            ]"
            :style="{
                left: word.x + 'px',
                top: word.y + 'px',
                opacity: word.type === 'hero' ? 0.8 : 0.6,
                transform: `rotate(${word.rotation}deg)`
            }"
        >
            {{ word.text }}
        </span>
    </div>

    <!-- ACTIVE LAYER (Flashlight Reveal) -->
    <div
        class="absolute inset-0 grid-layer will-change-[mask-image]"
        :style="{
            maskImage: `radial-gradient(circle 400px at ${mouse.x}px ${mouse.y}px, black 0%, transparent 100%)`,
            webkitMaskImage: `radial-gradient(circle 400px at ${mouse.x}px ${mouse.y}px, black 0%, transparent 100%)`
        }"
    >
        <span
            v-for="word in words"
            :key="'high-'+word.id"
            class="absolute font-mono tracking-tighter whitespace-nowrap leading-none transition-all duration-75"
            :class="[
                word.fontSize,
                word.type === 'hero' ? 'font-black text-white z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'font-bold text-gray-500'
            ]"
            :style="{
                left: word.x + 'px',
                top: word.y + 'px',
                transform: `rotate(${word.rotation}deg) scale(${word.type === 'hero' ? 1.1 : 1})`
            }"
        >
            {{ word.text }}
        </span>
    </div>

  </div>
</template>

<style scoped>
.grid-layer {
    /* Optimization */
    pointer-events: none;
}
</style>
