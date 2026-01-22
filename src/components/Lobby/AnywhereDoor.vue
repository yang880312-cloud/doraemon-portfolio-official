<script setup>
import { ref, onMounted } from 'vue'

const isOpen = ref(false)
const emit = defineEmits(['click'])

// 3D Tilt Logic
const doorContainer = ref(null)
const tiltStyle = ref({})
const knobStyle = ref({})

function handleMouseMove(e) {
  if (!doorContainer.value) return

  const rect = doorContainer.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  // Calculate rotation (max 15 degrees)
  const rotateX = ((y - centerY) / centerY) * -15
  const rotateY = ((x - centerX) / centerX) * 15

  tiltStyle.value = {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
    transition: 'transform 0.1s ease-out'
  }

  // Parallax for Knob
  knobStyle.value = {
    transform: `translate(${rotateY * 1.5}px, ${rotateX * 1.5}px)`
  }
}

function handleMouseLeave() {
  tiltStyle.value = {
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s ease-out' // Smooth reset
  }
  knobStyle.value = { transform: 'translate(0, 0)' }
}

function toggleDoor() {
  if (!isOpen.value) {
    // If closed, emit click to let parent handle logic (e.g. show tooltip)
    emit('click')
  }
}

function open() {
  isOpen.value = true
}

defineExpose({ open, isOpen })

// Particles
const particles = ref([])
onMounted(() => {
  for (let i = 0; i < 20; i++) {
    particles.value.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      dur: 2 + Math.random() * 3,
      delay: Math.random() * 2
    })
  }
})
</script>

<template>
  <div
    class="door-wrapper relative flex items-center justify-center py-10"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Magical Particles -->
    <div class="absolute inset-0 pointer-events-none overflow-visible">
      <div
        v-for="p in particles"
        :key="p.id"
        class="absolute w-1 h-1 bg-pink-400 rounded-full animate-float opacity-0 shadow-[0_0_10px_#f472b6]"
        :style="{
          left: `${p.x}%`,
          top: `${p.y}%`,
          animationDuration: `${p.dur}s`,
          animationDelay: `${p.delay}s`
        }"
      ></div>
    </div>

    <!-- The Door Container with Tilt -->
    <div
      ref="doorContainer"
      class="door-container relative preserve-3d cursor-pointer"
      :style="tiltStyle"
      @click="toggleDoor"
    >
      <!-- Outer Glow/Aura -->
      <div class="absolute inset-[-20px] bg-pink-500/20 rounded-[20px] blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <div
        class="door-frame w-56 h-96 bg-gradient-to-br from-pink-600 to-pink-800 rounded-t-[3rem] rounded-b-lg relative border-4 border-pink-900 shadow-[0_20px_50px_rgba(236,72,153,0.4)] overflow-hidden"
      >
        <!-- The Door Leaf -->
        <div
          class="door-leaf absolute inset-0 bg-door-pink rounded-t-[3rem] rounded-b-lg origin-left transition-transform duration-1000 ease-in-out border-r-4 border-pink-400 flex items-center justify-end pr-6 group"
          :class="{ open: isOpen }"
        >
          <!-- Surface Detail (Wood grain or Magic texture) -->
          <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 mix-blend-overlay"></div>

          <!-- Knob -->
          <div
            class="relative w-6 h-6 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.6)] z-10 transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_20px_rgba(250,204,21,1)]"
            :style="knobStyle"
          >
             <div class="absolute inset-0 bg-white/50 rounded-full animate-ping opacity-0 group-hover:opacity-50"></div>
          </div>
        </div>

        <!-- The Void (Behind the door) -->
        <div
          class="door-void absolute inset-2 bg-black overflow-hidden rounded-t-[2.5rem] rounded-b opacity-0 transition-opacity duration-300 delay-300"
          :class="{ 'opacity-100': isOpen }"
        >
          <div class="stars absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-twinkle opacity-50"></div>

          <!-- Galaxy Swirl Animation inside -->
          <div class="absolute inset-[-50%] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-spin-slow blur-xl rounded-full mix-blend-screen"></div>

          <div
            class="absolute inset-0 flex items-center justify-center text-xs text-white/50 tracking-[0.3em] font-black"
          >
            READY
          </div>
        </div>
      </div>

      <!-- Floor Shadow -->
      <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-4 bg-black/50 blur-md rounded-[100%] transition-all duration-300 group-hover:scale-125 group-hover:bg-pink-900/50"></div>
    </div>
  </div>
</template>

<style scoped>
.preserve-3d {
  transform-style: preserve-3d;
}
.door-leaf {
  transform-style: preserve-3d;
  z-index: 2;
  /* Specific Doraemon Pink */
  background-color: #fca5a5;
  background-image: linear-gradient(135deg, #fecaca 0%, #f87171 100%);
}
.door-leaf.open {
  transform: rotateY(-130deg);
}
.animate-float {
  animation: floatParticle 3s infinite ease-in-out;
}
@keyframes floatParticle {
  0%, 100% { transform: translateY(0) scale(0); opacity: 0; }
  50% { transform: translateY(-20px) scale(1); opacity: 0.8; }
}
.animate-twinkle {
  animation: twinkle 4s infinite linear;
}
@keyframes twinkle {
  0% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 0.3; }
}
.animate-spin-slow {
  animation: spin 10s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
