<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDataStore } from '@/stores/dataStore'

const store = useDataStore()
const emit = defineEmits(['back'])

// --- Data: The Hero's Journey (Defaults) ---
const rawExperience = computed(() => store.getProfile()?.experience || [])

const experiences = computed(() => {
  let list = [...rawExperience.value]

  // Use rich "Story Game" defaults if empty or just has a single placeholder
  if (list.length <= 1) {
    return [
      {
        id: 'hero-3',
        company: 'The New Horizon',
        role: 'Future Creator',
        period: '2026 - Present',
        description: 'Now seeking to equip human teams with advanced AI weaponry. Ready to deploy into high-intensity development environments and turn imagination into reality.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        theme: 'purple', // Nebula / Future
        techStack: ['Artificial General Intelligence', 'Quantum Computing', 'Neural Link API'],
        achievements: [
            'Architected the first sentient coding assistant.',
            'Reduced global development latency by 99%.',
            'Pioneered "Thought-to-Code" interface.'
        ]
      },
      {
        id: 'hero-2',
        company: 'Matsushiba Lab',
        role: 'Gadget Architect',
        period: '2023 - 2026',
        description: 'Specialized in 4th-dimensional state management. Built the "Anywhere Door" routing system which reduced user travel time to zero. Led a team of mini-dora robots to optimize production.',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
        theme: 'orange', // Industrial / Build
        techStack: ['Vue.js 4.0', 'Hyper-Loop Routing', 'Mini-Dora Swarm Ops'],
        achievements: [
            'Successfully deployed "Anywhere Door" to 1B+ users.',
            'Optimized gadget production efficiency by 200%.',
            'Mentored 50 Junior Robots to Senior level.'
        ]
      },
      {
        id: 'hero-1',
        company: 'Robot Factory',
        role: 'Prototype Model Ø',
        period: '2112 (Origin)',
        description: 'Manufactured with a passion for clean code and problem-solving algorithms. Passed all quality assurance tests with S-Rank. Initialized: Perfect.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        theme: 'blue', // Blueprint / Origin
        techStack: ['Assembly', 'Core Logic Circuitry', 'Fusion Reactor v1'],
        achievements: [
            'Passed QA tests with 0 defects (S-Rank).',
            'Compiled kernel in 0.001ms.',
            'Established the "Doraemon" design pattern.'
        ]
      }
    ]
  }
  return list.map(item => ({
      ...item,
      // Fallback details for custom items if missing
      theme: item.theme || 'cyan',
      techStack: item.techStack || ['Custom Tech 1', 'Custom Tech 2'],
      achievements: item.achievements || ['Key achievement 1', 'Key achievement 2']
  }))
})

// --- Theme Config ---
const themeColors = {
    purple: {
        main: 'text-purple-400',
        bg: 'bg-purple-500',
        border: 'border-purple-500',
        shadow: 'shadow-purple-500/50',
        gradient: 'from-purple-500',
        btnHover: 'hover:bg-purple-500/20'
    },
    orange: {
        main: 'text-orange-400',
        bg: 'bg-orange-500',
        border: 'border-orange-500',
        shadow: 'shadow-orange-500/50',
        gradient: 'from-orange-500',
        btnHover: 'hover:bg-orange-500/20'
    },
    blue: {
        main: 'text-blue-400',
        bg: 'bg-blue-500',
        border: 'border-blue-500',
        shadow: 'shadow-blue-500/50',
        gradient: 'from-blue-500',
        btnHover: 'hover:bg-blue-500/20'
    },
    cyan: { // Default
        main: 'text-cyan-400',
        bg: 'bg-cyan-500',
        border: 'border-cyan-500',
        shadow: 'shadow-cyan-500/50',
        gradient: 'from-cyan-500',
        btnHover: 'hover:bg-cyan-500/20'
    }
}

// --- State ---
const currentIndex = ref(0)
const showDetails = ref(false)
const showOnboarding = ref(true)

const currentTheme = computed(() => {
    const t = experiences.value[currentIndex.value]?.theme || 'cyan'
    return themeColors[t] || themeColors.cyan
})

const isLastChapter = computed(() => currentIndex.value === experiences.value.length - 1)

// --- Actions ---
function next() {
  if (currentIndex.value < experiences.value.length - 1) {
    playSound()
    currentIndex.value++
    showDetails.value = false // Reset detail view
  }
}

function prev() {
  if (currentIndex.value > 0) {
    playSound()
    currentIndex.value--
    showDetails.value = false
  }
}

function select(index) {
  if (currentIndex.value !== index) {
    playSound()
    currentIndex.value = index
    showDetails.value = false
  }
}

function toggleDetails() {
    playSound()
    showDetails.value = !showDetails.value
}

// Pseudo Sound Effect Visual
const soundTrigger = ref(false)
function playSound() {
  soundTrigger.value = true
  setTimeout(() => soundTrigger.value = false, 200)
}

onMounted(() => {
  store.fetchProfile()
  // Disable onboarding after 3s
  setTimeout(() => { showOnboarding.value = false }, 3500)
})
</script>

<template>
  <div class="fixed inset-0 bg-[#050510] text-white font-sans overflow-hidden select-none flex flex-col md:flex-row">

    <!-- Onboarding Overlay -->
    <Transition name="fade">
        <div v-if="showOnboarding" class="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center pointer-events-none">
            <div class="text-2xl font-mono text-cyan-400 tracking-widest animate-pulse">INITIALIZING TIME MACHINE...</div>
            <div class="mt-4 w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div class="h-full bg-cyan-500 animate-loading-bar"></div>
            </div>
            <div class="mt-8 text-xs text-gray-500 font-mono">SCROLL TO TRAVEL</div>
        </div>
    </Transition>

    <!-- Immersive Background & Warp Effect -->
    <div class="absolute inset-0 z-0 transition-all duration-1000 overflow-hidden"
         :class="{ 'warp-speed-active': isLastChapter }">

        <!-- Deep Space Nebula -->
        <div
            class="absolute inset-0 opacity-80 transition-all duration-1000"
            :class="`bg-[radial-gradient(circle_at_30%_50%,var(--tw-gradient-stops))]`"
            :style="{ '--tw-gradient-from': currentTheme.bg.replace('bg-', '') + '90', '--tw-gradient-to': '#000000' }"
        ></div>

        <!-- Explicit Theme Gradients -->
        <div v-if="experiences[currentIndex]?.theme === 'purple'" class="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#581c87_0%,#000000_70%)] opacity-80 transition-opacity duration-1000"></div>
        <div v-if="experiences[currentIndex]?.theme === 'orange'" class="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#7c2d12_0%,#000000_70%)] opacity-80 transition-opacity duration-1000"></div>
        <div v-if="experiences[currentIndex]?.theme === 'blue'"   class="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#1e3a8a_0%,#000000_70%)] opacity-80 transition-opacity duration-1000"></div>

        <!-- Stars / Warp Lines -->
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 stars-layer"></div>

        <!-- Warp Speed Streaks (Visible only in last chapter) -->
        <div class="absolute inset-0 warp-streaks opacity-0 transition-opacity duration-2000" :class="{ 'opacity-100': isLastChapter }">
             <div class="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(255,255,255,0.1)_20deg,transparent_40deg)] animate-spin-slow mix-blend-screen"></div>
             <div class="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#a855f720_100%)] animate-pulse"></div>
        </div>

        <!-- Grid Floor -->
        <div class="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.05)_100%)]"></div>
    </div>

    <!-- LEFT: The Controller (Reel) with COCKPIT FRAME -->
    <div class="relative z-10 w-full md:w-[40%] h-[40%] md:h-full flex flex-col items-center justify-center p-6 md:p-12">

        <!-- Cockpit Glass Panel Frame -->
        <div class="absolute inset-6 md:inset-12 bg-black/40 backdrop-blur-md rounded-2xl border transition-colors duration-500 shadow-2xl flex flex-col items-center justify-center"
             :class="[currentTheme.border + '/40', currentTheme.shadow]">

             <!-- Corner Decorations (Tech Feel) -->
             <div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-xl" :class="currentTheme.border"></div>
             <div class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-xl" :class="currentTheme.border"></div>
             <div class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-xl" :class="currentTheme.border"></div>
             <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-xl" :class="currentTheme.border"></div>

            <!-- Decoration: Mechanical Header -->
            <div class="absolute top-6 left-8 font-mono text-xs tracking-[0.2em] flex items-center gap-2" :class="currentTheme.main">
                <div class="w-2 h-2 rounded-full animate-ping" :class="currentTheme.bg"></div>
                TIME_NAVIGATOR // {{ experiences[currentIndex]?.period }}
            </div>

            <!-- The Reel Visual -->
            <div class="relative h-[300px] w-full overflow-hidden mask-gradient-y mt-8">
                <!-- Focus Frame (Lens) - Explicitly Centered -->
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[110px] w-[80%] border-y-2 pointer-events-none rounded-lg transition-colors duration-500 z-0 bg-white/5"
                     :class="currentTheme.border + '/50 shadow-[0_0_30px_currentColor]'"></div>

                <!-- Scrollable List - Centered Origin -->
                <div
                    class="absolute top-1/2 w-full transition-transform duration-500 ease-out z-10"
                    :style="{ transform: `translateY(calc(-50% - ${currentIndex * 100}px))` }"
                >
                    <div
                        v-for="(exp, index) in experiences"
                        :key="exp.id"
                        @click="select(index)"
                        class="h-[100px] flex items-center justify-center cursor-pointer group transition-all duration-300 relative"
                        :class="{ 'scale-110 opacity-100': currentIndex === index, 'opacity-40 scale-90': currentIndex !== index }"
                    >
                        <!-- Card Item -->
                        <div class="relative w-[70%] p-4 border-l-4 bg-gray-900/90 transition-colors shadow-lg"
                             :class="currentIndex === index ? currentTheme.border : 'border-gray-700'">
                            <div class="text-[10px] font-mono mb-1 transition-colors" :class="currentIndex === index ? currentTheme.main : 'text-gray-500'">{{ exp.period }}</div>
                            <div class="font-bold text-lg truncate">{{ exp.company }}</div>

                            <!-- Active Indicator -->
                            <div v-if="currentIndex === index" class="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rotate-45" :class="currentTheme.bg + ' shadow-[0_0_10px_currentColor]'"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Physical Controls -->
            <div class="flex gap-8 mt-4 mb-4">
                <button
                    @click="prev"
                    :disabled="currentIndex === 0"
                    class="group relative w-16 h-16 rounded-full border-2 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 bg-black/50"
                    :class="[currentTheme.border, currentTheme.btnHover]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" :class="currentTheme.main"><path d="m18 15-6-6-6 6"/></svg>
                </button>

                <button
                    @click="next"
                    :disabled="currentIndex === experiences.length - 1"
                    class="group relative w-16 h-16 rounded-full border-2 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 bg-black/50"
                    :class="[currentTheme.border, currentTheme.btnHover]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" :class="currentTheme.main"><path d="m6 9 6 6 6-6"/></svg>
                </button>
            </div>
        </div>
    </div>

    <!-- RIGHT: The Screen (Projection) -->
    <div class="relative z-10 flex-1 h-full p-8 md:p-16 flex items-center justify-center">
        <!-- Connecting Light Beam -->
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-1 bg-gradient-to-r blur-[2px] hidden md:block transition-colors duration-500"
             :class="currentTheme.gradient + '/50 from-transparent'"></div>

        <Transition name="fade-slide" mode="out-in">
            <div
                :key="currentIndex"
                class="w-full max-w-3xl bg-black/60 border rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md flex flex-col relative transition-colors duration-500"
                :class="currentTheme.border"
            >

                <!-- Detail Modal Overlay -->
                <div v-if="showDetails" class="absolute inset-0 z-20 bg-gray-900/95 flex flex-col p-8 overflow-y-auto animate-fade-in">
                     <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
                         <h3 class="text-xl font-bold text-white flex gap-2 items-center">
                             <span :class="currentTheme.main">///</span> MISSION_LOG_DETAILS
                         </h3>
                         <button @click="showDetails = false" class="text-gray-500 hover:text-white">CLOSE [X]</button>
                     </div>

                     <div class="grid md:grid-cols-2 gap-8">
                         <div>
                             <h4 class="text-sm text-gray-400 font-mono mb-3">TECH_STACK</h4>
                             <div class="flex flex-wrap gap-2">
                                 <span v-for="tech in experiences[currentIndex].techStack" :key="tech"
                                     class="px-3 py-1 bg-white/5 border border-white/10 rounded text-sm text-gray-300 font-mono">
                                     {{ tech }}
                                 </span>
                             </div>
                         </div>
                         <div>
                             <h4 class="text-sm text-gray-400 font-mono mb-3">KEY_ACHIEVEMENTS</h4>
                             <ul class="space-y-2">
                                 <li v-for="ach in experiences[currentIndex].achievements" :key="ach"
                                     class="text-sm text-gray-300 flex gap-2">
                                     <span :class="currentTheme.main">></span> {{ ach }}
                                 </li>
                             </ul>
                         </div>
                     </div>
                </div>

                <!-- Main Card Content -->
                <div class="h-8 bg-gray-900/80 border-b border-gray-800 flex items-center px-4 gap-2">
                    <div class="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div class="w-3 h-3 rounded-full bg-green-500/50"></div>
                    <div class="flex-1 text-center font-mono text-[10px] text-gray-500">STORY_MODE_ACTIVE // {{ experiences[currentIndex]?.theme?.toUpperCase() }}</div>
                </div>

                <div class="p-0 flex flex-col md:flex-row h-[400px] md:h-[500px]">
                    <!-- Image Half -->
                    <div class="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden bg-gray-900 group">
                        <img
                            :src="experiences[currentIndex]?.image"
                            class="w-full h-full object-cover transition-transform duration-[10s] ease-linear transform group-hover:scale-110"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                        <div class="absolute bottom-6 left-6 right-6">
                            <h2 class="text-3xl md:text-4xl font-black text-white leading-tight mb-2 drop-shadow-lg">
                                {{ experiences[currentIndex]?.company }}
                            </h2>
                            <div class="font-bold tracking-wide text-sm border-l-2 pl-2" :class="[currentTheme.main, currentTheme.border]">
                                {{ experiences[currentIndex]?.role }}
                            </div>
                        </div>
                    </div>

                    <!-- Text Half -->
                    <div class="flex-1 p-8 md:p-10 flex flex-col justify-center relative">
                        <!-- Watermark -->
                        <div class="absolute top-4 right-4 text-6xl opacity-5 font-black z-0">0{{ currentIndex + 1 }}</div>

                        <div class="relative z-10 space-y-6">
                            <p class="text-lg leading-relaxed text-gray-300 font-sans border-l border-gray-700 pl-6">
                                {{ experiences[currentIndex]?.description }}
                            </p>

                            <!-- Dive Deep Button -->
                            <div class="pt-6 border-t border-gray-800">
                                <button
                                    @click="toggleDetails"
                                    class="w-full py-2 bg-transparent border-dashed border-2 rounded text-sm font-bold tracking-widest hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                                    :class="[currentTheme.border, currentTheme.main]"
                                >
                                    <span>ACCESS DATA LOG</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                </button>
                            </div>

                            <!-- Last Slide CTA -->
                            <div v-if="currentIndex === experiences.length - 1" class="pt-2">
                                <button class="w-full py-3 text-white font-bold rounded shadow-lg transition-all flex items-center justify-center gap-2 animate-bounce-slight"
                                        :class="currentTheme.bg + ' hover:opacity-90 ' + currentTheme.shadow">
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
    mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }

.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.animate-loading-bar { animation: loadingBar 3s ease-out forwards; }
@keyframes loadingBar { from { width: 0%; } to { width: 100%; } }

.animate-bounce-slight { animation: bounceSlight 2s infinite; }
@keyframes bounceSlight { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }

/* Warp Speed Effect */
.warp-speed-active .stars-layer {
    animation: zoomStars 2s infinite linear;
    opacity: 0.5;
}

@keyframes zoomStars {
    0% { transform: scale(1); opacity: 0.3; }
    50% { opacity: 0.8; }
    100% { transform: scale(2); opacity: 0; }
}

.animate-spin-slow {
    animation: spin 10s linear infinite;
}
@keyframes spin {
    from { transform: scale(1.5) rotate(0deg); }
    to { transform: scale(1.5) rotate(360deg); }
}
</style>
