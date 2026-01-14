<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['finished'])
const el = ref(null)
const bellRef = ref(null)

onMounted(() => {
  const tl = gsap.timeline({
    onComplete: () => emit('finished')
  })

  // Bell shake
  tl.to(bellRef.value, {
    rotation: 15,
    duration: 0.1,
    yoyo: true,
    repeat: 5,
    ease: 'power1.inOut'
  })
  
  // Scale up to fill screen (transition out)
  tl.to(bellRef.value, {
    scale: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power4.in',
    delay: 0.2
  })
  
  // Fade out container
  tl.to(el.value, {
    opacity: 0,
    duration: 0.5,
    display: 'none'
  }, '-=0.5')
})
</script>

<template>
  <div ref="el" class="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]">
    <div ref="bellRef" class="relative w-32 h-32">
      <!-- Simple CSS Bell -->
      <div class="absolute inset-x-0 mx-auto top-0 w-24 h-24 bg-[#F1C40F] rounded-full border-4 border-black shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2)]">
        <!-- Horizontal line -->
        <div class="absolute top-[30%] w-full h-8 border-y-2 border-black/80 bg-transparent rounded-[50%]"></div>
        <!-- Hole -->
        <div class="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-6 h-6 bg-black rounded-full"></div>
      </div>
      <!-- Glow -->
      <div class="absolute inset-0 bg-[#F1C40F] blur-xl opacity-20 animate-pulse"></div>
    </div>
    
    <div class="absolute bottom-20 text-blue-500 font-mono text-sm tracking-[0.5em] animate-pulse">
      INITIALIZING...
    </div>
  </div>
</template>
