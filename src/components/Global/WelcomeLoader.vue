<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['finished'])
const progress = ref(0)
const logs = ref([])

const logMessages = [
  'INITIALIZING SYSTEM...',
  'CONNECTING TO 22ND CENTURY...',
  'LOADING GADGETS...',
  'CALIBRATING ANYWHERE DOOR...',
  'SYNCING TIMELINES...',
  'ACCESS GRANTED.'
]

onMounted(() => {
  // Simulate loading progress
  const tl = gsap.timeline({
    onComplete: () => {
      // Fade out
      gsap.to('.loader-container', {
        opacity: 0,
        duration: 0.8,
        onComplete: () => emit('finished')
      })
    }
  })

  // Bell Bounce
  tl.fromTo('.bell-icon', { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(1.7)' })

  // Progress Bar Animation
  tl.to(progress, {
    value: 100,
    duration: 2.5,
    ease: 'power2.inOut',
    onUpdate: () => {
        const index = Math.floor((progress.value / 100) * (logMessages.length - 1))
        if (!logs.value.includes(logMessages[index])) {
            logs.value.push(logMessages[index])
        }
    }
  })
})
</script>

<template>
  <div
    class="fixed inset-0 bg-[#050505] z-[99999] flex flex-col items-center justify-center loader-container cursor-wait"
  >
    <!-- Logo / Bell -->
    <div class="bell-icon w-20 h-20 rounded-full border-4 border-[#FBB03B] bg-[#fcd34d] shadow-[0_0_30px_#FBB03B] mb-8 animate-bounce relative">
        <div class="absolute top-[40%] left-0 w-full h-[2px] bg-[#d97706]"></div>
        <div class="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full/50"></div>
    </div>

    <!-- Progress Bar -->
    <div class="w-64 h-2 bg-gray-800 rounded-full overflow-hidden relative">
      <div
        class="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>

    <!-- Percentage -->
    <div class="font-mono text-blue-400 mt-4 text-xl font-bold">
      {{ Math.floor(progress) }}%
    </div>

    <!-- Terminal Logs -->
    <div class="mt-8 font-mono text-xs text-gray-500 h-6 overflow-hidden text-center">
        <div v-for="log in logs.slice(-1)" :key="log" class="animate-pulse">
            > {{ log }}
        </div>
    </div>
  </div>
</template>
