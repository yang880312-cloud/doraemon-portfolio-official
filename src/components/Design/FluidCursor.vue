<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

const cursorRef = ref(null)
const followerRef = ref(null)

function updateCursor(e) {
  // Main dot follows instantly
  if (cursorRef.value) {
    gsap.set(cursorRef.value, {
      x: e.clientX,
      y: e.clientY
    })
  }
  
  // Follower lags behind to create stretch
  if (followerRef.value) {
    gsap.to(followerRef.value, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.6,
      ease: 'power3.out'
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
  <div class="pointer-events-none fixed inset-0 z-50 overflow-hidden mix-blend-exclusion">
    <!-- SVG Filter for Gooey Effect -->
    <svg class="hidden">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>

    <!-- Cursor Container with Filter -->
    <div style="filter: url(#goo);" class="absolute inset-0 w-full h-full">
      <!-- Main Dot -->
      <div 
        ref="cursorRef" 
        class="absolute top-0 left-0 w-8 h-8 bg-purple-400 rounded-full -translate-x-1/2 -translate-y-1/2"
      ></div>
      
      <!-- Follower (Jelly Tail) -->
      <div 
        ref="followerRef" 
        class="absolute top-0 left-0 w-12 h-12 bg-purple-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-80"
      ></div>
    </div>
  </div>
</template>
