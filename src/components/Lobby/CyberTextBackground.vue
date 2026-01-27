<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { skills, fillers } from '@/data/lobbyKeywords'

// --- Config ---
const GRID_SIZE = 100 // pixels approximately
const SEARCH_RADIUS = 250 // pixels

const container = ref(null)
const words = ref([])
const mouse = { x: -1000, y: -1000 }

// Flatten word list with weights (Skills appear more often)
const wordPool = [...skills, ...skills, ...fillers]

function generateGrid() {
  if (!container.value) return

  const { clientWidth, clientHeight } = container.value
  const cols = Math.floor(clientWidth / 120) // Adjust density
  const rows = Math.floor(clientHeight / 60)

  const tempWords = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isSkill = Math.random() > 0.7 // 30% chance to be a skill
      const pool = isSkill ? skills : fillers
      const text = pool[Math.floor(Math.random() * pool.length)]

      tempWords.push({
        id: `${r}-${c}`,
        text,
        x: (c * 120) + (Math.random() * 20), // Slight jitter
        y: (r * 60) + (Math.random() * 10),
        isSkill,
        opacity: 0.1, // Base opacity
        scale: 1,
        color: isSkill ? '#60a5fa' : '#4b5563' // Blue vs Gray
      })
    }
  }
  words.value = tempWords
}

// --- Interaction Loop ---
let animationFrame
function animate() {
  // Update visual state based on mouse
  // Note: Doing this in JS for 1000+ items might be heavy, but let's try.
  // Optimization: Only update DOM via CSS variables or check distance rigorously.
  // Actually, Vue's reactivity might be too slow for 60fps on 500 items.
  // BETTER APPROACH: Use CSS Hover? No, we need radial influence.

  // OPTIMIZED APPROACH: Update only items within a distinct grid sector?
  // For now, let's just stick to a lighter loop or CSS Custom Properties if possible.

  // Let's try pure Vue first but keep the list static and bind styles.
  // Actually, updating 500 reactive objects per frame IS bad.
  // Alternative: updates happen on mousemove, throttled.

  requestAnimationFrame(animate)
}

function handleMouseMove(e) {
  mouse.x = e.clientX
  mouse.y = e.clientY

  // Check distance for all words (Manual loop is faster than reactivity loop)
  // We will simply update the transform/opacity of the DOM elements directly if possible
  // OR, we assume a powerful enough PC. Let's try to be smart.
  // We can use CSS `mask-image` for the "Flashlight" effect!
  // It's WAY cheaper than calculating 500 distances in JS.
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

    <!-- The Text Layers -->
    <!-- Layer 1: Base Dim Text (Static) -->
    <div class="absolute inset-0 grid-layer opacity-20">
        <span
            v-for="word in words"
            :key="'base-'+word.id"
            class="absolute font-mono text-xs tracking-wider whitespace-nowrap"
            :class="word.isSkill ? 'font-bold text-gray-400' : 'text-gray-700'"
            :style="{ left: word.x + 'px', top: word.y + 'px' }"
        >
            {{ word.text }}
        </span>
    </div>

    <!-- Layer 2: Highlight Text (Revealed by Mask) -->
    <!-- This layer is identical but brighter, and masked by a radial gradient following mouse -->
    <div
        class="absolute inset-0 grid-layer will-change-[mask-image]"
        :style="{
            maskImage: `radial-gradient(circle 300px at ${mouse.x}px ${mouse.y}px, black 0%, transparent 100%)`,
            webkitMaskImage: `radial-gradient(circle 300px at ${mouse.x}px ${mouse.y}px, black 0%, transparent 100%)`
        }"
    >
        <span
            v-for="word in words"
            :key="'high-'+word.id"
            class="absolute font-mono text-sm tracking-widest whitespace-nowrap transition-transform duration-75"
            :class="word.isSkill ? 'font-black text-cyan-400 z-10' : 'font-bold text-gray-200'"
            :style="{ left: word.x + 'px', top: word.y + 'px' }"
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
