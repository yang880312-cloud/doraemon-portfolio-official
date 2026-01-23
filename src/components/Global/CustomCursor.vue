<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const cursor = ref(null)
const trailer = ref(null)

const x = ref(0)
const y = ref(0)
const trailerX = ref(0)
const trailerY = ref(0)

function move(e) {
  x.value = e.clientX
  y.value = e.clientY

  if(cursor.value) {
    cursor.value.animate({
      left: `${x.value}px`,
      top: `${y.value}px`
    }, { duration: 0, fill: "forwards" })
  }
}

// Smooth trailing animation loop
function animateTrailer() {
  const distX = x.value - trailerX.value
  const distY = y.value - trailerY.value

  trailerX.value += distX * 0.15 // Lag factor
  trailerY.value += distY * 0.15

  if(trailer.value) {
    trailer.value.animate({
        left: `${trailerX.value}px`,
        top: `${trailerY.value}px`
    }, { duration: 0, fill: "forwards" })
  }

  requestAnimationFrame(animateTrailer)
}

onMounted(() => {
  window.addEventListener('mousemove', move)
  requestAnimationFrame(animateTrailer)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', move)
})
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block mix-blend-screen">
    <!-- Main Dot -->
    <div ref="cursor" class="absolute w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_white]"></div>
    <!-- Trailer Ring -->
    <div ref="trailer" class="absolute w-8 h-8 border border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"></div>
  </div>
</template>
