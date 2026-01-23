<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '@/stores/dataStore'

const store = useDataStore()
const emit = defineEmits(['back'])

// --- Data Setup ---
const rawExperience = computed(() => store.getProfile()?.experience || [])

const experiences = computed(() => {
  let list = [...rawExperience.value]
  if (list.length <= 1) {
    return [
      {
        id: 'hero-3',
        company: 'The New Horizon',
        role: 'Future Creator',
        period: '2026 - Present',
        description: 'Now seeking to equip human teams with advanced AI weaponry. Ready to deploy into high-intensity development environments.',
        bullets: ['Seeking Senior/Lead Roles', 'Specialty: AI & Human-Computer Interaction', 'Ready for Immediate Deployment'],
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        theme: 'purple',
        techStack: ['AGI', 'Quantum', 'Neural Link'],
        achievements: ['Architected Sentient Assistant', '99% Global Latency Reduction']
      },
      {
        id: 'hero-2',
        company: 'Matsushiba Lab',
        role: 'Gadget Architect',
        period: '2023 - 2026',
        description: 'Built the "Anywhere Door" routing system reducing travel time to zero. Led a team of mini-dora robots.',
        bullets: ['Senior Frontend Developer', 'Leads Team of 10+', '200% Efficiency Boost'],
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
        theme: 'orange',
        techStack: ['Vue 4', 'Hyper-Loop', 'Mini-Dora Ops'],
        achievements: ['Deployed to 1B+ Users', 'Mentored 50 Junior Bots']
      },
      {
        id: 'hero-1',
        company: 'Robot Factory',
        role: 'Prototype Model Ø',
        period: '2112 (Origin)',
        description: 'Manufactured with passion for clean code. Passed QA with S-Rank.',
        bullets: ['Graduated S-Rank', 'Algorithms & Design', 'Clean Code Advocate'],
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        theme: 'blue',
        techStack: ['Assembly', 'Logic Circuits', 'Fusion Reactor'],
        achievements: ['0 Defects (S-Rank)', '0.001ms Kernel Compile']
      }
    ]
  }
  return list.map(item => ({
      ...item,
      theme: item.theme || 'cyan',
      techStack: item.techStack || ['Tech A', 'Tech B'],
      achievements: item.achievements || ['Achievement 1', 'Achievement 2'],
      bullets: item.bullets || [item.description]
  }))
})

const themeColors = {
    purple: { main: 'text-purple-400', bg: 'bg-purple-500', border: 'border-purple-500', shadow: 'shadow-purple-500/50', gradient: 'from-purple-900', hover: 'hover:bg-purple-500/20' },
    orange: { main: 'text-orange-400', bg: 'bg-orange-500', border: 'border-orange-500', shadow: 'shadow-orange-500/50', gradient: 'from-orange-900', hover: 'hover:bg-orange-500/20' },
    blue:   { main: 'text-blue-400',   bg: 'bg-blue-500',   border: 'border-blue-500',   shadow: 'shadow-blue-500/50',   gradient: 'from-blue-900',   hover: 'hover:bg-blue-500/20' },
    cyan:   { main: 'text-cyan-400',   bg: 'bg-cyan-500',   border: 'border-cyan-500',   shadow: 'shadow-cyan-500/50',   gradient: 'from-cyan-900',   hover: 'hover:bg-cyan-500/20' }
}

// --- State ---
const currentIndex = ref(0)
const showHireModal = ref(false)

const currentTheme = computed(() => {
    const t = experiences.value[currentIndex.value]?.theme || 'cyan'
    return themeColors[t] || themeColors.cyan
})

// --- Actions ---
function setIndex(index) {
    currentIndex.value = index
}

function openHire() {
    showHireModal.value = true
}

onMounted(() => {
    store.fetchProfile()
})
</script>

<template>
  <div class="fixed inset-0 bg-[#020205] text-white font-sans overflow-hidden select-none flex items-center justify-center">

    <!-- Background Layer -->
    <div class="absolute inset-0 z-0">
        <!-- Dynamic Gradient Backdrop -->
        <div class="absolute inset-0 transition-colors duration-1000 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div class="absolute inset-0 opacity-40 transition-all duration-1000 bg-[radial-gradient(circle_at_50%_0%,var(--tw-gradient-stops))] from-transparent via-transparent to-transparent"
             :style="{ '--tw-gradient-from': currentTheme.bg.replace('bg-', '') + '30' }"></div>

        <!-- Grid & Stars -->
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div class="absolute bottom-0 w-full h-[60%] bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.03)_100%)] pointer-events-none"></div>
    </div>

    <!-- MAIN CONTAINER: The Command Center -->
    <div class="relative z-10 w-full max-w-6xl h-[90vh] md:h-[80vh] flex flex-col md:grid md:grid-cols-[280px_1fr] gap-6 p-4 md:p-0">

        <!-- LEFT RAIL: Navigation & Status -->
        <div class="flex flex-col gap-4 order-2 md:order-1 h-full">
            <!-- Profile Summary Card -->
            <div class="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800 p-6 flex flex-col items-center text-center shadow-lg">
                <div class="w-20 h-20 rounded-full border-2 mb-4 overflow-hidden relative" :class="currentTheme.border">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" class="w-full h-full bg-gray-800" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <h1 class="text-xl font-bold text-white">Doraemon</h1>
                <div class="text-xs font-mono text-gray-400 mt-1">LVL. 99 ARCHITECT</div>

                <div class="w-full h-px bg-gray-800 my-4"></div>

                <!-- Status Indicators -->
                <div class="w-full space-y-3">
                    <div class="flex justify-between text-xs">
                        <span class="text-gray-500">STATUS</span>
                        <span class="text-green-400 font-bold animate-pulse">● OPEN FOR WORK</span>
                    </div>
                    <div class="flex justify-between text-xs">
                        <span class="text-gray-500">EXP</span>
                        <span class="text-white font-mono">5+ YEARS</span>
                    </div>
                    <div class="flex justify-between text-xs">
                        <span class="text-gray-500">PROJECTS</span>
                        <span class="text-white font-mono">12 DELIVERED</span>
                    </div>
                </div>
            </div>

            <!-- Timeline Navigation (Vertical Tabs) -->
            <div class="flex-1 bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800 p-4 flex flex-col gap-2 overflow-y-auto shadow-inner">
                <div class="text-xs font-bold text-gray-500 mb-2 px-2">TIMELINE_LOGS</div>

                <button
                    v-for="(exp, index) in experiences"
                    :key="exp.id"
                    @click="setIndex(index)"
                    class="group relative w-full p-3 rounded-lg border border-transparent text-left transition-all duration-300 hover:bg-white/5"
                    :class="currentIndex === index ? 'bg-white/10 ' + currentTheme.border : 'hover:border-gray-700'"
                >
                    <!-- Active Marker -->
                    <div v-if="currentIndex === index" class="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-colors" :class="currentTheme.bg"></div>

                    <div class="pl-3">
                        <div class="text-[10px] font-mono mb-0.5 transition-colors"
                             :class="currentIndex === index ? currentTheme.main : 'text-gray-500 group-hover:text-gray-300'">
                            {{ exp.period }}
                        </div>
                        <div class="text-sm font-bold text-gray-200 truncate">{{ exp.company }}</div>
                        <div class="text-[10px] text-gray-600 truncate">{{ exp.role }}</div>
                    </div>
                </button>

                 <!-- Fill remaining space -->
                <div class="flex-1"></div>

                <div class="mt-4 pt-4 border-t border-gray-800">
                    <button @click="openHire" class="w-full py-3 bg-green-600 hover:bg-green-500 text-white text-xs font-bold tracking-widest rounded shadow-lg transition-all flex items-center justify-center gap-2">
                        <span>INITIATE CONTACT</span>
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </button>
                    <button @click="$emit('back')" class="w-full mt-2 py-2 text-gray-500 hover:text-white text-xs text-center">
                        EXIT SYSTEM
                    </button>
                </div>
            </div>
        </div>

        <!-- RIGHT MAIN DASHBOARD: The Active Card -->
        <div class="order-1 md:order-2 flex flex-col h-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden shadow-2xl relative">
             <!-- Header Bar of Dashboard -->
             <div class="h-12 border-b border-gray-800 flex items-center px-6 justify-between bg-black/20">
                 <div class="flex items-center gap-3">
                     <span class="w-3 h-3 rounded-full bg-red-500/50"></span>
                     <span class="w-3 h-3 rounded-full bg-yellow-500/50"></span>
                     <span class="w-3 h-3 rounded-full bg-green-500/50"></span>
                 </div>
                 <div class="font-mono text-xs tracking-widest" :class="currentTheme.main">
                     DATA_STREAM // {{ experiences[currentIndex]?.period }}
                 </div>
             </div>

             <!-- Main Content Area -->
             <div class="flex-1 flex flex-col md:flex-row relative overflow-hidden">

                 <!-- Visual Column (Image + Overlay) -->
                 <div class="w-full md:w-5/12 h-64 md:h-full relative group">
                     <img :src="experiences[currentIndex]?.image" class="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                     <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                     <div class="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent"></div>

                     <!-- Overlay Data on Image -->
                     <div class="absolute bottom-6 left-6 right-6">
                         <div class="inline-block px-3 py-1 rounded-full text-[10px] font-bold mb-2 border bg-black/50 backdrop-blur-sm shadow"
                              :class="[currentTheme.border, currentTheme.main]">
                             {{ experiences[currentIndex]?.theme.toUpperCase() }} PROTOCOL
                         </div>
                         <h2 class="text-3xl font-black text-white leading-tight drop-shadow-lg mb-1">{{ experiences[currentIndex]?.company }}</h2>
                         <div class="text-lg font-medium text-gray-300">{{ experiences[currentIndex]?.role }}</div>
                     </div>
                 </div>

                 <!-- Data Column (Details) -->
                 <div class="flex-1 p-8 md:p-10 flex flex-col overflow-y-auto">

                     <!-- Quick Stats Row -->
                     <div class="flex flex-wrap gap-2 mb-8">
                         <span v-for="tech in experiences[currentIndex]?.techStack" :key="tech"
                               class="px-3 py-1.5 text-xs font-mono border rounded bg-gray-800/50 text-gray-300 border-gray-700">
                             {{ tech }}
                         </span>
                     </div>

                     <!-- Narrative -->
                     <div class="mb-8">
                         <h3 class="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Mission Brief</h3>
                         <p class="text-gray-300 leading-relaxed border-l-2 pl-4" :class="currentTheme.border">
                             {{ experiences[currentIndex]?.description }}
                         </p>
                     </div>

                     <!-- Bullet Points (Recruiter Gold) -->
                     <div class="flex-1">
                         <h3 class="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">Key Impacts</h3>
                         <ul class="space-y-3">
                             <li v-for="item in experiences[currentIndex]?.bullets" :key="item" class="flex gap-3 text-sm text-white group">
                                 <span class="font-bold opacity-80" :class="currentTheme.main">>></span>
                                 <span class="group-hover:translate-x-1 transition-transform">{{ item }}</span>
                             </li>
                         </ul>
                     </div>

                     <!-- Achievements Footer -->
                     <div class="mt-8 pt-6 border-t border-gray-800">
                         <div class="grid grid-cols-2 gap-4">
                             <div v-for="(ach, i) in experiences[currentIndex]?.achievements" :key="i" class="bg-gray-800/30 p-3 rounded border border-gray-800">
                                 <div class="text-[10px] text-gray-500 mb-1">ACHIEVEMENT_0{{i+1}}</div>
                                 <div class="text-xs font-bold text-gray-200">{{ ach }}</div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
        </div>

    </div>

    <!-- Hire Modal -->
    <Transition name="fade">
        <div v-if="showHireModal" class="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div class="bg-gray-900 border-2 border-green-500 rounded-xl p-8 w-full max-w-md shadow-2xl relative">
                <button @click="showHireModal = false" class="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
                <h2 class="text-2xl font-black text-green-500 mb-2">HIRE_PROTOCOL</h2>
                <p class="text-gray-400 mb-6 text-sm">Select a secure channel to contact the candidate.</p>
                <div class="space-y-3">
                    <button class="w-full py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg flex items-center px-4 gap-4 transition-all">
                        <span class="text-2xl">📄</span>
                        <div class="text-left"><div class="font-bold text-white">Download Resume</div><div class="text-xs text-gray-500">PDF, 2.4MB</div></div>
                    </button>
                    <button class="w-full py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg flex items-center px-4 gap-4 transition-all">
                        <span class="text-2xl">📧</span>
                        <div class="text-left"><div class="font-bold text-white">Copy Email</div><div class="text-xs text-gray-500">doraemon@future.com</div></div>
                    </button>
                </div>
            </div>
        </div>
    </Transition>

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
