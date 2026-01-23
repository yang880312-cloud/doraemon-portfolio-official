<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useDataStore } from '@/stores/dataStore'
import gsap from 'gsap'

const store = useDataStore()
const emit = defineEmits(['back'])

// --- Data ---
const rawExperience = computed(() => store.getProfile()?.experience || [])

// Processed experience with placeholders if empty, and sorted reverse chronological
const experiences = computed(() => {
  let list = [...rawExperience.value]
  // Sort: Newest first (assuming data might be random, but usually user inputs in order)
  // If no date field is strict, we trust the array order.

  if (list.length === 0) {
    return [
      {
        id: 'demo-1',
        company: 'Future Tech',
        role: 'Full Stack Visionary',
        period: '2026 - Present',
        description: 'Building the next generation of web experiences using advanced AI agents and spatial computing interfaces.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: 'demo-2',
        company: 'Creative Studio',
        role: 'Frontend Lead',
        period: '2024 - 2026',
        description: 'Led a team of 5 developers to create award-winning interactive websites. Specialized in Vue.js and WebGL.',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: 'demo-3',
        company: 'Startup Inc.',
        role: 'Junior Developer',
        period: '2022 - 2024',
        description: 'Developed core features for a SaaS platform. Optimized database queries and improved load times by 40%.',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop'
      }
    ]
  }
  return list
})

// --- State ---
const currentIndex = ref(0)
const isDragging = ref(false)
const startY = ref(0)
const currentY = ref(0)
const targetY = ref(0) // The "scroll" position
const containerRef = ref(null)

// --- Constants ---
const ITEM_HEIGHT = 160 // Distance between cards
const VISIBLE_RANGE = 2 // How many cards above/below to show

// --- Animation Loop ---
let animationFrame = null

function updateScroll() {
  // Lerp currentY to targetY for smooth scrolling
  const diff = targetY.value - currentY.value
  currentY.value += diff * 0.1

  // Snap to nearest index when not dragging
  if (!isDragging.value && Math.abs(diff) < 1) {
    const snapIndex = Math.round(targetY.value / ITEM_HEIGHT)
    targetY.value = snapIndex * ITEM_HEIGHT
    currentIndex.value = Math.max(0, Math.min(experiences.value.length - 1, snapIndex))
  }

  // Boundary constraints (elastic)
  const maxScroll = (experiences.value.length - 1) * ITEM_HEIGHT
  if (!isDragging.value) {
     if (targetY.value < 0) targetY.value = targetY.value * 0.8
     if (targetY.value > maxScroll) targetY.value = maxScroll + (targetY.value - maxScroll) * 0.8
  }

  animationFrame = requestAnimationFrame(updateScroll)
}

// --- Interaction Handlers ---
function onWheel(e) {
  targetY.value += e.deltaY * 0.5

  // Clamp target immediately if we want hard stops, but elastic is nicer
  const maxScroll = (experiences.value.length - 1) * ITEM_HEIGHT
  targetY.value = Math.max(-100, Math.min(maxScroll + 100, targetY.value))
}

function onTouchStart(e) {
  isDragging.value = true
  startY.value = e.touches[0].clientY
}

function onTouchMove(e) {
  if (!isDragging.value) return
  const delta = startY.value - e.touches[0].clientY
  targetY.value += delta * 1.5 // Sensitivity
  startY.value = e.touches[0].clientY
}

function onTouchEnd() {
  isDragging.value = false
  // Snap logic handled in updateScroll
}

// Click to select
function selectItem(index) {
  targetY.value = index * ITEM_HEIGHT
}

onMounted(() => {
  store.fetchProfile()
  updateScroll()
  window.addEventListener('wheel', onWheel)
})

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  window.removeEventListener('wheel', onWheel)
})

</script>

<template>
  <div class="fixed inset-0 bg-black text-white font-sans overflow-hidden select-none">

    <!-- Background: Grid & Stars -->
    <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000_100%)] pointer-events-none"></div>
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-pulse pointer-events-none"></div>

    <!-- MAIN LAYOUT -->
    <div class="relative z-10 w-full h-full flex flex-col md:flex-row">

        <!-- LEFT: Projector Beam & Reel (Mobile: Bottom/Center) -->
        <div
          class="visible-reel relative w-full md:w-1/3 h-full flex items-center justify-center perspective-container"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
            <!-- The Beam -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-full bg-gradient-to-b from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 blur-xl pointer-events-none"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-32 bg-cyan-400 blur-sm pointer-events-none"></div>

            <!-- The 3D Reel -->
            <div class="reel-container relative w-64 h-full preserve-3d" ref="containerRef">
                <div
                    v-for="(exp, index) in experiences"
                    :key="exp.id || index"
                    class="reel-item absolute w-full h-32 left-0 top-1/2 -mt-16 transition-transform duration-75 ease-out cursor-pointer group"
                    :class="{ 'is-active': index === currentIndex }"
                    :style="{
                        transform: `translateY(${(index * ITEM_HEIGHT) - currentY}px) translateZ(${Math.abs((index * ITEM_HEIGHT) - currentY) < ITEM_HEIGHT ? 50 : -Math.abs((index * ITEM_HEIGHT) - currentY) * 0.5}px) rotateX(${((index * ITEM_HEIGHT) - currentY) * -0.1}deg)`,
                        opacity: 1 - Math.min(1, Math.abs((index * ITEM_HEIGHT) - currentY) / (ITEM_HEIGHT * 3)),
                        zIndex: 100 - Math.abs(index - currentIndex)
                    }"
                    @click="selectItem(index)"
                >
                    <!-- Glass Card -->
                    <div class="w-full h-full bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col justify-center relative shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-cyan-500/50 transition-colors">
                        <!-- Connecting Line (Film sprocket holes visual) -->
                        <div class="absolute -left-4 top-0 bottom-0 w-2 flex flex-col justify-between py-2">
                           <div v-for="n in 6" :key="n" class="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                        </div>

                        <div class="text-xs font-mono text-cyan-400 mb-1">{{ exp.period }}</div>
                        <h3 class="text-lg font-bold text-white truncate">{{ exp.company }}</h3>
                        <div class="text-xs text-gray-400 truncate">{{ exp.role }}</div>

                        <!-- Glow effect for active -->
                        <div v-if="index === currentIndex" class="absolute inset-0 rounded-xl bg-cyan-500/10 animate-pulse border border-cyan-500/50"></div>
                    </div>
                </div>
            </div>

            <!-- Projector Base Visual (Bottom) -->
            <div class="absolute bottom-8 left-1/2 -translate-x-1/2 w-40 h-20 bg-gradient-to-t from-black to-gray-900 rounded-t-full border-t border-cyan-500/30 flex justify-center items-start pt-2 opacity-80 pointer-events-none">
                 <div class="w-16 h-8 bg-cyan-500/20 blur-lg rounded-full animate-pulse"></div>
            </div>
        </div>

        <!-- RIGHT: Holographic Projection Screen -->
        <div class="flex-1 h-full relative flex items-center justify-center p-8 md:p-16">
            <Transition name="hologram">
                <div
                    :key="currentIndex"
                    class="relative w-full max-w-2xl bg-cyan-900/10 border border-cyan-500/20 rounded-2xl p-8 backdrop-blur-sm"
                >
                    <!-- Decor: Hologram scanlines -->
                    <div class="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none rounded-2xl"></div>
                    <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                    <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                    <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                    <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

                    <!-- Content -->
                    <div class="flex flex-col md:flex-row gap-6 relative z-10">
                        <!-- Main Image -->
                        <div class="w-full md:w-1/3 aspect-square bg-black/50 rounded-lg overflow-hidden border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                            <img
                                v-if="experiences[currentIndex]?.image"
                                :src="experiences[currentIndex].image"
                                class="w-full h-full object-cover"
                            />
                            <div v-else class="w-full h-full flex items-center justify-center text-cyan-500/20">
                                <span class="text-4xl">📷</span>
                            </div>
                        </div>

                        <!-- Text Info -->
                        <div class="flex-1 space-y-4">
                            <div>
                                <h2 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                    {{ experiences[currentIndex]?.company }}
                                </h2>
                                <h3 class="text-xl text-white font-mono mt-1">{{ experiences[currentIndex]?.role }}</h3>
                                <div class="inline-block px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-300 text-xs font-bold mt-2 border border-cyan-500/30">
                                    {{ experiences[currentIndex]?.period }}
                                </div>
                            </div>

                            <p class="text-cyan-100/80 leading-relaxed text-sm">
                                {{ experiences[currentIndex]?.description }}
                            </p>

                            <!-- Skills/Tech Stack (Mock generation if not present) -->
                            <div class="flex flex-wrap gap-2 pt-4">
                               <div class="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] rounded border border-blue-500/30">LEADERSHIP</div>
                               <div class="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] rounded border border-purple-500/30">STRATEGY</div>
                               <div class="px-2 py-0.5 bg-green-500/20 text-green-300 text-[10px] rounded border border-green-500/30">INNOVATION</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>

    <!-- Navigation Hint -->
    <div class="absolute bottom-8 right-8 text-xs font-mono text-cyan-500/50 animate-pulse hidden md:block">
        SCROLL TO TRAVEL IN TIME
    </div>

    <!-- Back Button -->
    <button
      @click="$emit('back')"
      class="absolute top-8 right-8 z-50 p-2 rounded-full border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
  </div>
</template>

<style scoped>
.perspective-container {
    perspective: 1000px;
}
.preserve-3d {
    transform-style: preserve-3d;
}

/* Hologram Transition */
.hologram-enter-active,
.hologram-leave-active {
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.hologram-enter-from,
.hologram-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
  filter: blur(10px);
}
</style>
