<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

const cursorRef = ref(null)
const x = ref(0)
const y = ref(0)

// Update cursor position
function updateCursor(e) {
  x.value = e.clientX
  y.value = e.clientY
  
  if (cursorRef.value) {
    gsap.to(cursorRef.value, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.15,
      ease: 'power2.out'
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
  <div 
    ref="cursorRef"
    class="pointer-events-none fixed top-0 left-0 z-50 flex flex-col items-start"
    style="transform: translate(0, 0);"
  >
    <!-- Probe Head (Triangle + Dot) -->
    <div class="relative">
      <div class="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-cyan-400 filter drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]"></div>
    </div>

    <!-- Data Label Container (Right side of probe) -->
    <div class="absolute top-0 left-4 bg-black/80 border border-cyan-500/50 rounded-sm px-2 py-1 backdrop-blur-sm shadow-xl">
      <div class="flex flex-col gap-[2px]">
        <div class="text-[9px] text-gray-400 uppercase tracking-widest leading-none">Coordinates</div>
        <div class="text-xs font-mono font-bold text-cyan-400 leading-none">{{ Math.round(x) }}, {{ Math.round(y) }}</div>
      </div>
      <!-- Connective Line -->
      <div class="absolute top-2 -left-4 w-4 h-[1px] bg-cyan-500/50"></div>
    </div>
    
  </div>
</template>
