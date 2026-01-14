<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

const cursorRef = ref(null)
const dotRef = ref(null)

function updateCursor(e) {
  if (cursorRef.value) {
    gsap.to(cursorRef.value, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: 'power2.out'
    })
  }
  if (dotRef.value) {
    gsap.to(dotRef.value, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.05,
      ease: 'power1.out'
    })
  }
}

onMounted(() => {
  window.addEventListener('mousemove', updateCursor)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateCursor)
})
</script>

<template>
  <div>
    <!-- Spotlight Halo -->
    <div 
      ref="cursorRef"
      class="pointer-events-none fixed top-0 left-0 z-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0)_60%)] mix-blend-screen"
    ></div>

    <!-- Central Center Dot (The "Mouse") -->
    <div 
      ref="dotRef"
      class="pointer-events-none fixed top-0 left-0 z-50 w-3 h-3 bg-white/80 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm mix-blend-overlay"
    ></div>
  </div>
</template>
