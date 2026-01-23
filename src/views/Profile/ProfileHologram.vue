<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDataStore } from '@/stores/dataStore'

const store = useDataStore()
const emit = defineEmits(['back'])

// --- Data: The Hero's Journey (Defaults) ---
const rawExperience = computed(() => store.getProfile()?.experience || [])

const experiences = computed(() => {
  let list = [...rawExperience.value]

  // Use rich "Story Game" defaults if empty or generic
  if (list.length === 0) {
    return [
      {
        id: 'hero-3',
        company: 'The New Horizon',
        role: 'Future Creator',
        period: '2026 - Present',
        description: 'Now seeking to equip human teams with advanced AI weaponry. Ready to deploy into high-intensity development environments and turn imagination into reality.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: 'hero-2',
        company: 'Matsushiba Lab',
        role: 'Gadget Architect',
        period: '2023 - 2026',
        description: 'Specialized in 4th-dimensional state management. Built the "Anywhere Door" routing system which reduced user travel time to zero. Led a team of mini-dora robots to optimize production.',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: 'hero-1',
        company: 'Robot Factory',
        role: 'Prototype Model Ø',
        period: '2112 (Origin)',
        description: 'Manufactured with a passion for clean code and problem-solving algorithms. Passed all quality assurance tests with S-Rank. Initialized: Perfect.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop'
      }
    ]
  }
  return list
})

// --- State ---
const currentIndex = ref(0)
const isAnimating = ref(false)

// --- Actions ---
function next() {
  if (currentIndex.value < experiences.value.length - 1) {
    playSound()
    currentIndex.value++
  }
}

function prev() {
  if (currentIndex.value > 0) {
    playSound()
    currentIndex.value--
  }
}

function select(index) {
  if (currentIndex.value !== index) {
    playSound()
    currentIndex.value = index
  }
}

// Pseudo Sound Effect Visual
const soundTrigger = ref(false)
function playSound() {
  soundTrigger.value = true
  setTimeout(() => soundTrigger.value = false, 200)
}

onMounted(() => {
  store.fetchProfile()
})
</script>

<template>
  <div class="fixed inset-0 bg-[#050510] text-white font-sans overflow-hidden select-none flex flex-col md:flex-row">

    <!-- Immersive Background -->
    <div class="absolute inset-0 z-0">
        <!-- Deep Space Nebula -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#1a237e_0%,#000000_70%)] opacity-80"></div>
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
        <!-- Grid Floor -->
        <div class="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(to_bottom,transparent_0%,#00ffff10_100%)]"></div>
    </div>

    <!-- LEFT: The Controller (Reel) -->
    <div class="relative z-10 w-full md:w-[40%] h-[40%] md:h-full flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm border-b md:border-r border-cyan-500/30">

        <!-- Decoration: Mechanical Header -->
        <div class="absolute top-6 left-6 text-cyan-500 font-mono text-xs tracking-[0.2em] flex items-center gap-2">
            <div class="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>
            TIME_NAVIGATOR // {{ experiences[currentIndex]?.period }}
        </div>

        <!-- The Reel Visual -->
        <div class="relative h-[300px] w-full flex items-center justify-center overflow-hidden mask-gradient-y">
            <div
                class="absolute w-64 transition-transform duration-500 ease-out"
                :style="{ transform: `translateY(${-currentIndex * 100}px)` }"
            >
                <div
                    v-for="(exp, index) in experiences"
                    :key="exp.id"
                    @click="select(index)"
                    class="h-[100px] flex items-center justify-center cursor-pointer group transition-all duration-300"
                    :class="{ 'scale-110 opacity-100': currentIndex === index, 'opacity-40 scale-90': currentIndex !== index }"
                >
                    <!-- Card Item -->
                    <div class="relative w-full mx-8 p-4 border-l-4 border-cyan-500/50 bg-gray-900/80 hover:bg-gray-800 transition-colors">
                        <div class="text-[10px] text-cyan-400 font-mono mb-1">{{ exp.period }}</div>
                        <div class="font-bold text-lg truncate">{{ exp.company }}</div>

                        <!-- Active Indicator -->
                        <div v-if="currentIndex === index" class="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-500 rotate-45 shadow-[0_0_10px_#06b6d4]"></div>
                    </div>
                </div>
            </div>

            <!-- Focus Frame (Lens) -->
            <div class="absolute inset-x-12 h-[110px] border-y-2 border-cyan-500/50 bg-cyan-500/5 pointer-events-none rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.1)]"></div>
        </div>

        <!-- Physical Controls -->
        <div class="flex gap-8 mt-8">
            <button
                @click="prev"
                :disabled="currentIndex === 0"
                class="group relative w-16 h-16 rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:bg-cyan-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
            >
                <!-- Glow -->
                <div class="absolute inset-0 bg-cyan-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <!-- Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-400 group-hover:text-white"><path d="m18 15-6-6-6 6"/></svg>
            </button>

            <button
                @click="next"
                :disabled="currentIndex === experiences.length - 1"
                class="group relative w-16 h-16 rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:bg-cyan-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
            >
                <div class="absolute inset-0 bg-cyan-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-400 group-hover:text-white"><path d="m6 9 6 6 6-6"/></svg>
            </button>
        </div>

        <!-- Sound Visual Feedback -->
        <div
            class="absolute bottom-4 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent transition-opacity duration-100"
            :class="soundTrigger ? 'opacity-100' : 'opacity-0'"
        ></div>
    </div>

    <!-- RIGHT: The Screen (Projection) -->
    <div class="relative z-10 flex-1 h-full p-8 md:p-16 flex items-center justify-center">
        <!-- Connecting Light Beam -->
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-1 bg-gradient-to-r from-cyan-500/50 to-transparent blur-[2px] hidden md:block"></div>

        <Transition name="fade-slide" mode="out-in">
            <div
                :key="currentIndex"
                class="w-full max-w-3xl bg-black/60 border border-cyan-900 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md flex flex-col"
            >
                <!-- Top Bar -->
                <div class="h-8 bg-gray-900/80 border-b border-gray-800 flex items-center px-4 gap-2">
                    <div class="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div class="w-3 h-3 rounded-full bg-green-500/50"></div>
                    <div class="flex-1 text-center font-mono text-[10px] text-gray-500">STORY_MODE_ACTIVE</div>
                </div>

                <!-- Content Area -->
                <div class="p-0 flex flex-col md:flex-row h-[400px] md:h-[500px]">
                    <!-- Image Half -->
                    <div class="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden bg-gray-900 group">
                        <img
                            :src="experiences[currentIndex]?.image"
                            class="w-full h-full object-cover transition-transform duration-[10s] ease-linear transform group-hover:scale-110"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                        <!-- Overlay Title -->
                        <div class="absolute bottom-6 left-6 right-6">
                            <h2 class="text-3xl md:text-4xl font-black text-white leading-tight mb-2 drop-shadow-lg">
                                {{ experiences[currentIndex]?.company }}
                            </h2>
                            <div class="text-cyan-400 font-bold tracking-wide text-sm border-l-2 border-cyan-400 pl-2">
                                {{ experiences[currentIndex]?.role }}
                            </div>
                        </div>
                    </div>

                    <!-- Text Half -->
                    <div class="flex-1 p-8 md:p-10 flex flex-col justify-center relative">
                        <!-- Watermark -->
                        <div class="absolute top-4 right-4 text-6xl opacity-5 font-black z-0">0{{ currentIndex + 1 }}</div>

                        <div class="relative z-10 space-y-6">
                             <!-- Description with Typewriter font -->
                            <p class="text-lg leading-relaxed text-gray-300 font-sans border-l border-gray-700 pl-6">
                                {{ experiences[currentIndex]?.description }}
                            </p>

                            <!-- Mini Stats / Skills -->
                            <div class="pt-6 border-t border-gray-800 flex gap-4">
                                <div class="px-4 py-2 bg-cyan-900/20 text-cyan-400 rounded text-xs font-bold border border-cyan-500/20">
                                    IMPACT
                                </div>
                                <div class="px-4 py-2 bg-purple-900/20 text-purple-400 rounded text-xs font-bold border border-purple-500/20">
                                    TECH
                                </div>
                            </div>

                            <!-- Last Slide CTA -->
                            <div v-if="currentIndex === experiences.length - 1" class="pt-4">
                                <button class="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 animate-bounce-slight">
                                    <span>CONTACT TO UNLOCK FUTURE</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>

    <!-- Back Button -->
    <button
      @click="$emit('back')"
      class="absolute top-6 right-6 z-50 p-3 rounded-full bg-black/50 border border-gray-700 hover:border-white text-white transition-all backdrop-blur-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  </div>
</template>

<style scoped>
.mask-gradient-y {
    mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.animate-bounce-slight {
    animation: bounceSlight 2s infinite;
}

@keyframes bounceSlight {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
}
</style>
