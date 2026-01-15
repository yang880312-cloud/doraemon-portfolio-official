<script setup>
// Lobby View Container
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDimensionStore } from '@/stores/dimension'
import gsap from 'gsap'
import AnywhereDoor from '@/components/Lobby/AnywhereDoor.vue'
import PhysicsWorld from '@/components/Lobby/PhysicsWorld.vue'
import LobbyCursor from '@/components/Lobby/LobbyCursor.vue'

const router = useRouter()
const store = useDimensionStore()
const doorRef = ref(null)
const showDoorHint = ref(false)

// Handle direct door click (Hint)
function onDoorClick() {
  if (doorRef.value && !doorRef.value.isOpen) {
    showDoorHint.value = true
    setTimeout(() => {
      showDoorHint.value = false
    }, 3000)
  }
}

// Watch for Navigation Request from Dock
watch(
  () => store.navigationRequest,
  async (req) => {
    if (req && req.route) {
      // 1. Open Door if closed
      if (doorRef.value && !doorRef.value.isOpen) {
        doorRef.value.open()
        // Wait for door open animation (approx 1s)
        await new Promise((r) => setTimeout(r, 800))
      }

      // 2. Zoom Effect
      gsap.to('.lobby-container', {
        scale: 5,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.in',
        onComplete: () => {
          router.push(req.route)
          store.setDimension(req.id) // Update store state manually here
          store.clearRequest()
        },
      })
    }
  },
)

onMounted(() => {
  // Reset Zoom on enter
  gsap.set('.lobby-container', { scale: 1, opacity: 1 })
})
</script>

<template>
  <div class="relative w-full h-full bg-void-black overflow-hidden lobby-container">
    <!-- 1. Physics World (Background / Interactive Layer) -->
    <LobbyCursor />
    <PhysicsWorld />

    <!-- 2. UI Overlay (Title, Door) -->
    <div
      class="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
    >
      <!-- Hero Title -->
      <div class="absolute top-[15%] text-center pointer-events-auto">
        <h1
          class="text-6xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse"
        >
          DORAEMON<br />PORTFOLIO
        </h1>
        <p class="text-sm uppercase tracking-[0.3em] opacity-70 text-blue-200">Logic & Magic</p>
      </div>

      <!-- The Door -->
      <div class="pointer-events-auto mt-20 relative">
        <AnywhereDoor ref="doorRef" @click="onDoorClick" />

        <!-- Hint Tooltip -->
        <Transition name="fade">
          <div
            v-if="showDoorHint"
            class="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 bg-black/80 text-white text-xs font-mono border border-pink-500 rounded-full"
          >
            SELECT A DIMENSION BELOW 👇
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
