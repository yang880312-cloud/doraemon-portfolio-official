<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useDataStore } from '@/stores/dataStore'
import { useHead } from '@vueuse/head'

const store = useDataStore()
const emit = defineEmits(['back'])

useHead({
  title: '個人機密檔案 (Profile)',
  meta: [
    { name: 'description', content: '查看詳細技能樹、工作經歷與機密任務數據。 (Access Restricted Data)' },
  ]
})

// --- Data Setup ---
// --- Data Setup ---
const profile = computed(() => store.getProfile() || {})
const rawExperience = computed(() => profile.value.experience || [])

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
const dashboardRef = ref(null)

// --- Actions ---
function setIndex(index) {
    currentIndex.value = index

    // Mobile RWD: Scroll to top of dashboard when clicking timeline
    // Wait for DOM to update (avoid scroll glitches)
    nextTick(() => {
        if (window.innerWidth < 768 && dashboardRef.value) {
            dashboardRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    })
}

function openHire() {
    showHireModal.value = true
}

onMounted(() => {
    store.fetchProfile()
})
</script>

<template>
  <!-- Main Wrapper -->
  <!-- Adjusted height and added pb-20 to prevent overlap with the bottom NavigationDock -->
  <!-- Main Wrapper -->
  <!-- RWD Fix: Allow scrolling on mobile, fixed on desktop -->
  <!-- Main Wrapper -->
  <!-- RWD Fix: Allow scrolling on mobile (block layout), fixed on desktop (flex center) -->
  <div class="fixed inset-0 bg-[#020205] text-white font-sans block md:flex md:items-center md:justify-center pb-20 md:pb-0 overflow-y-auto md:overflow-hidden">

    <!-- Background Layer -->
    <div class="fixed inset-0 z-0 pointer-events-none">
        <!-- Dynamic Gradient Backdrop -->
        <div class="absolute inset-0 transition-colors duration-1000 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div class="absolute inset-0 opacity-40 transition-all duration-1000 bg-[radial-gradient(circle_at_50%_0%,var(--tw-gradient-stops))] from-transparent via-transparent to-transparent"
             :style="{ '--tw-gradient-from': currentTheme.bg.replace('bg-', '') + '30' }"></div>
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
    </div>

    <!-- MAIN CONTAINER: The Command Center -->
    <!-- RWD Fix: Auto height on mobile, fixed 85vh on desktop -->
    <div class="relative z-10 w-full max-w-6xl mx-auto h-auto md:h-[80vh] flex flex-col md:grid md:grid-cols-[280px_1fr] gap-12 md:gap-6 px-6 pt-32 md:p-0 md:mt-0 pb-32 md:pb-0">

        <!-- LEFT RAIL: Navigation & Status -->
        <!-- Mobile Order: 1 (Top) -->
        <div class="flex flex-col gap-6 md:gap-4 order-1 md:order-1 h-auto md:h-full min-h-0">
            <!-- Profile Summary Card -->
            <div class="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800 p-6 flex flex-col items-center text-center shadow-lg shrink-0">
                <div class="w-20 h-20 rounded-full border-2 mb-4 overflow-hidden relative group" :class="currentTheme.border">
                    <img :src="profile.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 bg-gray-800" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <!-- Hover Glow Effect for Name -->
                <h1 class="text-xl font-bold text-white transition-shadow duration-300" :class="`hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`">{{ profile.name || 'Loading...' }}</h1>
                <div class="text-xs font-mono text-gray-400 mt-1 uppercase">{{ profile.title || 'ARCHITECT' }}</div>

                <div class="w-full h-px bg-gray-800 my-4"></div>

                <!-- Status Indicators -->
                <div class="w-full space-y-3 group cursor-default">
                    <div class="flex justify-between text-xs transition-colors group-hover:text-green-300">
                        <span class="text-gray-500">STATUS</span>
                        <span class="text-green-400 font-bold animate-pulse">● OPEN FOR WORK</span>
                    </div>
                </div>

                 <!-- Dynamic Bio -->
                 <div v-if="profile.bio" class="mt-4 text-[10px] text-gray-500 text-left w-full border-t border-gray-800 pt-3 leading-relaxed line-clamp-4 font-mono">
                     {{ profile.bio }}
                 </div>
            </div>

            <!-- Timeline Navigation (Vertical Tabs) -->
            <!-- Mobile: Full height (h-auto) to screen scroll. Desktop: Flex-1 with internal scroll. -->
            <div class="flex-none md:flex-1 bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800 p-4 flex flex-col gap-2 md:overflow-y-auto shadow-inner custom-scrollbar h-auto md:h-auto">
                <div class="text-xs font-bold text-gray-500 mb-2 px-2 flex justify-between items-center">
                    <span>TIMELINE_LOGS</span>
                    <span class="w-2 h-2 rounded-full bg-gray-600 animate-ping"></span>
                </div>

                <button
                    v-for="(exp, index) in experiences"
                    :key="exp.id"
                    @click="setIndex(index)"
                    class="group relative w-full p-3 rounded-lg border border-transparent text-left transition-all duration-200 outline-none"
                    :class="[
                        currentIndex === index ? 'bg-white/10 ' + currentTheme.border : 'hover:bg-white/5 hover:border-gray-700 hover:scale-[1.02] hover:shadow-lg',
                        'active:scale-95'
                    ]"
                >
                    <!-- Active Marker -->
                    <div v-if="currentIndex === index" class="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-colors" :class="currentTheme.bg"></div>
                    <!-- Hover Marker (Ghost) -->
                    <div v-else class="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-colors bg-gray-700 opacity-0 group-hover:opacity-100"></div>

                    <div class="pl-3">
                        <div class="text-[10px] font-mono mb-0.5 transition-colors"
                             :class="currentIndex === index ? currentTheme.main : 'text-gray-500 group-hover:text-gray-300'">
                            {{ exp.period }}
                        </div>
                        <div class="text-sm font-bold text-gray-200 truncate group-hover:text-white transition-colors">{{ exp.company }}</div>
                        <div class="text-[10px] text-gray-600 truncate group-hover:text-gray-400">{{ exp.role }}</div>
                    </div>
                </button>

                 <!-- Fill remaining space -->
                <div class="flex-1"></div>

                <div class="mt-4 pt-4 border-t border-gray-800">
                    <button @click="openHire"
                        class="w-full py-3 bg-green-600 hover:bg-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:scale-[1.02] text-white text-xs font-bold tracking-widest rounded shadow-lg transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 group">

                        <span class="group-hover:animate-pulse">INITIATE CONTACT</span>
                        <svg class="w-3 h-3 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </button>
                    <!-- "Exit System" button removed as requested -->
                </div>
            </div>
        </div>

        <!-- RIGHT MAIN DASHBOARD: The Active Card -->
        <!-- Mobile Order: 2 (Bottom) -->
        <div ref="dashboardRef" class="scroll-mt-32 order-2 md:order-2 flex flex-col h-auto md:h-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden shadow-2xl relative transition-all duration-500 hover:border-gray-600 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] group/dashboard">
             <!-- Header Bar of Dashboard -->
             <div class="h-12 border-b border-gray-800 flex items-center px-6 justify-between bg-black/20 shrink-0">
                 <div class="flex items-center gap-3">
                     <span class="w-3 h-3 rounded-full bg-red-500/50 transition-transform group-hover/dashboard:scale-110"></span>
                     <span class="w-3 h-3 rounded-full bg-yellow-500/50 transition-transform group-hover/dashboard:scale-110 delay-75"></span>
                     <span class="w-3 h-3 rounded-full bg-green-500/50 transition-transform group-hover/dashboard:scale-110 delay-150"></span>
                 </div>
                 <div class="font-mono text-xs tracking-widest transition-colors" :class="currentTheme.main">
                     DATA_STREAM // {{ experiences[currentIndex]?.period }}
                 </div>
             </div>

             <!-- Main Content Area -->
             <div class="flex-1 flex flex-col md:flex-row relative md:overflow-hidden">

                 <!-- Visual Column (Image + Overlay) -->
                 <div class="w-full md:w-5/12 aspect-video md:h-full relative group/image overflow-hidden shrink-0">
                     <img :src="experiences[currentIndex]?.image" class="w-full h-full object-cover opacity-60 transition-all duration-700 group-hover/image:scale-110 group-hover/image:opacity-80" />
                     <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                     <!-- Scanline Effect -->
                     <div class="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-10 pointer-events-none"></div>

                     <!-- Overlay Data on Image -->
                     <div class="absolute bottom-6 left-6 right-6 translate-y-0 transition-transform duration-300 group-hover/image:-translate-y-2">
                         <div class="inline-block px-3 py-1 rounded-full text-[10px] font-bold mb-2 border bg-black/50 backdrop-blur-sm shadow"
                              :class="[currentTheme.border, currentTheme.main]">
                             {{ experiences[currentIndex]?.theme.toUpperCase() }} PROTOCOL
                         </div>
                         <h2 class="text-3xl font-black text-white leading-tight drop-shadow-lg mb-1">{{ experiences[currentIndex]?.company }}</h2>
                         <div class="text-lg font-medium text-gray-300">{{ experiences[currentIndex]?.role }}</div>
                     </div>
                 </div>

                 <!-- Data Column (Details) -->
                 <div class="flex-1 p-6 md:p-10 flex flex-col md:overflow-y-auto custom-scrollbar">

                     <!-- Quick Stats Row -->
                     <div class="flex flex-wrap gap-2 mb-8">
                         <span v-for="tech in experiences[currentIndex]?.techStack" :key="tech"
                               class="px-3 py-1.5 text-xs font-mono border rounded bg-gray-800/50 text-gray-300 border-gray-700 transition-colors hover:border-gray-500 hover:text-white cursor-help">
                             {{ tech }}
                         </span>
                     </div>

                     <!-- Narrative -->
                     <div class="mb-8">
                         <h3 class="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Mission Brief</h3>
                         <p class="text-gray-300 leading-relaxed border-l-2 pl-4 transition-colors hover:text-white" :class="currentTheme.border">
                             {{ experiences[currentIndex]?.description }}
                         </p>
                     </div>

                     <!-- Bullet Points -->
                     <div class="flex-1">
                         <h3 class="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">Key Impacts</h3>
                         <ul class="space-y-3">
                             <li v-for="item in experiences[currentIndex]?.bullets" :key="item" class="flex gap-3 text-sm text-white group/item cursor-default">
                                 <span class="font-bold opacity-80 transition-transform group-hover/item:translate-x-1" :class="currentTheme.main">>></span>
                                 <span class="group-hover/item:text-green-300 transition-colors">{{ item }}</span>
                             </li>
                         </ul>
                     </div>

                     <!-- Achievements Footer -->
                     <div class="mt-8 pt-6 border-t border-gray-800">
                         <div class="grid grid-cols-2 gap-4">
                             <div v-for="(ach, i) in experiences[currentIndex]?.achievements" :key="i"
                                  class="bg-gray-800/30 p-3 rounded border border-gray-800 transition-colors hover:bg-gray-800/60 hover:border-gray-600">
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
                    <button class="w-full py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg flex items-center px-4 gap-4 transition-all group">
                        <span class="text-2xl group-hover:scale-110 transition-transform">📄</span>
                        <div class="text-left"><div class="font-bold text-white">Download Resume</div><div class="text-xs text-gray-500">PDF, 2.4MB</div></div>
                    </button>
                    <button class="w-full py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg flex items-center px-4 gap-4 transition-all group">
                        <span class="text-2xl group-hover:scale-110 transition-transform">📧</span>
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

/* Custom Scrollbar for inner content */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}
</style>
