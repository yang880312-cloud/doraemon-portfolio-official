<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)
const isVisible = ref(false)

const updateCursor = (e) => {
  x.value = e.clientX
  y.value = e.clientY
  isVisible.value = true
}

const hideCursor = () => {
  isVisible.value = false
}

onMounted(() => {
  window.addEventListener('mousemove', updateCursor)
  window.addEventListener('mouseleave', hideCursor)
  document.body.style.cursor = 'none' // Hide default cursor
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateCursor)
  window.removeEventListener('mouseleave', hideCursor)
  document.body.style.cursor = 'auto'
})
</script>

<template>
  <div
    class="fixed pointer-events-none z-[9999] transition-opacity duration-200 ease-out"
    :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }"
    :style="{
      left: `${x}px`,
      top: `${y}px`
    }"
  >
    <!-- Flashlight Body (Small Torch) -->
    <div class="relative -top-4 -left-4">
       <!-- SVG Flashlight -->
       <svg width="40" height="40" viewBox="0 0 24 24" fill="none" class="drop-shadow-lg transform -rotate-45">
          <path d="M12 2L14.5 9H9.5L12 2Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.5" stroke-linejoin="round"/>
          <rect x="8" y="9" width="8" height="12" rx="2" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.5"/>
          <path d="M10 14H14" stroke="#991b1b" stroke-linecap="round"/>
       </svg>

       <!-- The Light Beam -->
       <div class="absolute top-0 left-0 w-[300px] h-[300px] bg-[radial-gradient(circle_at_center,rgba(255,255,200,0.4)_0%,transparent_60%)] -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-overlay"></div>
       <div class="absolute top-0 left-0 w-[50px] h-[50px] bg-white/50 blur-xl -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
    </div>
  </div>
</template>
