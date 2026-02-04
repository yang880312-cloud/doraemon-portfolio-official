<script setup>
// Lobby View Container
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDimensionStore } from '@/stores/dimension'
import { useHead } from '@vueuse/head'
import gsap from 'gsap'
import AnywhereDoor from '@/components/Lobby/AnywhereDoor.vue'
import CyberTextBackground from '@/components/Lobby/CyberTextBackground.vue'
import LobbyCursor from '@/components/Lobby/LobbyCursor.vue'

useHead({
  title: '傳送門 (Portal)',
  meta: [
    { name: 'description', content: '哆啦A夢的百寶袋入口。選擇您的維度：個人檔案、專案管理、設計藝廊。 (The Gateway)' },
  ]
})

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

      // 2. Warp Sequence
      const tl = gsap.timeline({
        onComplete: () => {
          store.setDimension(req.id)
          store.clearRequest()
        }
      })

      // Phase 1: Accelerate In
      tl.to('.lobby-container', {
        scale: 15, // Excessive scale for wrap effect
        duration: 1.2,
        ease: 'expo.in',
        transformOrigin: 'center 60%' // Zoom towards door center
      })

      // Phase 2: Whiteout Flash at impact
      .to('.transition-flash', {
        opacity: 1,
        duration: 0.1,
        ease: 'power1.out'
      }, '-=0.1') // Overlap with end of zoom

      // Phase 3: Route Change & Clear
      .call(() => {
        router.push(req.route)
      })
      .to('.transition-flash', {
        opacity: 0,
        duration: 0.5,
        delay: 0.2 // Let page load a bit behind white screen
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
    <CyberTextBackground />
    <LobbyCursor />

    <!-- Flash Overlay for Transition -->
    <div class="transition-flash absolute inset-0 bg-white z-50 pointer-events-none opacity-0 mix-blend-hard-light"></div>

    <!-- 2. UI Overlay (Title, Door) -->
    <div
      class="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
    >
      <!-- Hero Title Removed -->


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
