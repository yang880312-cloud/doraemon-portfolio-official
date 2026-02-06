<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useDataStore } from '@/stores/dataStore'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useRouter } from 'vue-router'

gsap.registerPlugin(ScrollTrigger)

const store = useDataStore()
const router = useRouter()
const profile = computed(() => store.getProfile() || {})

// Ensure we have experiences (Mock Data if empty)
const experiences = computed(() => {
    const raw = profile.value.experience || []
    if (raw.length > 0) return raw

    // Fallback Mock Data (Migrated from Hologram)
    return [
      {
        id: 'hero-3',
        company: 'The New Horizon',
        role: 'Future Creator',
        period: '2026 - Present',
        description: 'Architecting the next generation of AI-driven interfaces. Leading the integration of neural inputs with web standards.',
        bullets: ['Seeking Senior/Lead Roles', 'Specialty: AI & Human-Computer Interaction', 'Ready for Immediate Deployment'],
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        techStack: ['AGI', 'Quantum Web', 'Neural Link', 'Vue 5']
      },
      {
        id: 'hero-2',
        company: 'Matsushiba Lab',
        role: 'Gadget Architect',
        period: '2023 - 2026',
        description: 'Developed the "Anywhere Door" routing mechanism, reducing user navigation latency by 100%. Orchestrated a fleet of micro-services.',
        bullets: ['Senior Frontend Developer', 'Leads Team of 10+', 'Efficiency Boost: 200%'],
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
        techStack: ['Vue 4', 'Hyper-Loop', 'Mini-Dora Ops', 'TS']
      },
      {
        id: 'hero-1',
        company: 'Robot Factory',
        role: 'Prototype Model Ø',
        period: '2112 (Origin)',
        description: 'Initial assembly and calibration. Passed S-Rank quality assurance tests with zero-defect rating.',
        bullets: ['Graduated S-Rank', 'Algorithms & Design', 'Clean Code Advocate'],
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        techStack: ['Assembly', 'Logic Circuits', 'Fusion Reactor']
      }
    ]
})

function goBack() {
    router.push('/')
}

onMounted(() => {
    // 1. Reveal Intro Module
    gsap.from('.intro-module', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
    })

    // 2. Timeline Trigger
    // Use a slight delay to allow DOM render
    setTimeout(() => {
        const eras = gsap.utils.toArray('.era-card')
        eras.forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                x: i % 2 === 0 ? 50 : -50, // Alternate entry
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            })
        })
    }, 200)

    // Background parallax
    gsap.to('.stars-bg', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
            trigger: '.time-machine',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true
        }
    })
})
</script>

<template>
  <div class="time-machine min-h-screen bg-black text-white relative font-sans overflow-x-hidden">

    <!-- 1. Background (Dimmed for Readability) -->
    <div class="fixed inset-0 z-0 bg-[#050505] pointer-events-none">
        <div class="stars-bg absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80"></div>
        <!-- Grid -->
        <div class="absolute inset-0 opacity-10" :style="{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
        }"></div>
    </div>

    <!-- 2. Sticky HUD (Top) -->
    <div class="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5">
        <button @click="goBack" class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <span class="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white">←</span>
            <span class="text-xs font-mono tracking-widest hidden md:inline">RETURN</span>
        </button>
        <div class="flex items-center gap-4">
             <div class="hidden md:flex items-center gap-2 text-xs font-mono text-green-400">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                SYSTEM: ONLINE
             </div>
             <a href="mailto:doraemon@future.com" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded shadow-lg shadow-blue-900/50 transition-all active:scale-95">
                CONTACT
             </a>
        </div>
    </div>

    <!-- 3. Scroll Content -->
    <div class="relative z-10 w-full max-w-5xl mx-auto px-6 pb-32">

        <!-- INTRO MODULE (Identity Card) -->
        <div class="intro-module min-h-[90vh] flex flex-col justify-center items-center text-center pt-20">
            <!-- Profile Image Ring -->
            <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-blue-500/50 p-1 mb-8 relative">
                <div class="absolute inset-0 border-2 border-blue-400 rounded-full animate-ping opacity-20"></div>
                <img :src="profile.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dora'" class="w-full h-full rounded-full object-cover bg-gray-800" />
            </div>

            <div class="space-y-4 mb-10 max-w-2xl">
                 <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono tracking-wider">
                    <span class="text-xl">⚡</span> {{ profile.title || 'FULL STACK INNOVATOR' }}
                 </div>
                 <h1 class="text-5xl md:text-7xl font-black tracking-tight text-white mb-2">
                    {{ profile.name || 'CANDIDATE' }}
                 </h1>
                 <p class="text-lg md:text-xl text-gray-400 leading-relaxed">
                    {{ profile.bio || 'Equipping humanity with future-proof digital tools. Specializing in high-performance web applications and sleek user interfaces.' }}
                 </p>
            </div>

            <!-- Core Skills Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
                <div v-for="skill in ['Vue.js Ecosystem', 'Interactive UI', 'System Arch', 'Gadget Ops']" :key="skill"
                     class="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all cursor-default group">
                     <h3 class="text-sm font-bold text-gray-300 group-hover:text-blue-300">{{ skill }}</h3>
                </div>
            </div>

            <!-- Scroll Hint -->
            <div class="mt-20 flex flex-col items-center gap-2 opacity-50 animate-bounce">
                <div class="w-px h-10 bg-gradient-to-b from-transparent to-white"></div>
                <span class="text-xs font-mono tracking-widest">SCROLL TO SCAN HISTORY</span>
            </div>
        </div>


        <!-- TIMELINE SECTION (Denser) -->
        <div class="relative mt-20 md:mt-0 space-y-12 md:space-y-0">

            <!-- Central Line (Desktop) -->
            <div class="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-blue-500/0 -translate-x-1/2"></div>

            <div v-for="(exp, index) in experiences" :key="index"
                 class="era-section relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center py-12">

                 <!-- Connector Dot -->
                 <div class="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black border-2 border-blue-500 rounded-full z-10 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>

                 <!-- Content Block -->
                 <!-- If Index Even: Text Left, Year Right (Desktop) -->
                 <!-- If Index Odd: Year Left, Text Right (Desktop) -->

                 <!-- Logic: We just render Card in one col and Year in other, flipping order via CSS classes -->

                 <!-- Year Marker (Desktop Side) -->
                 <div class="hidden md:flex flex-col justify-center" :class="index % 2 === 0 ? 'items-end text-right md:pr-4' : 'order-last items-start text-left md:pl-4'">
                     <div class="text-5xl font-black text-white/10 select-none">{{ exp.period.split(/[ -]/)[0] }}</div>
                     <div class="text-blue-400 font-mono text-sm tracking-wider">{{ exp.period }}</div>
                 </div>

                 <!-- Card (The Content) -->
                 <div class="era-card" :class="index % 2 === 0 ? 'md:order-last' : ''">
                    <div class="relative p-6 md:p-8 rounded-2xl bg-gray-900/60 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 transition-all hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] group overflow-hidden">

                        <!-- Glow -->
                        <div class="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 blur-[50px] group-hover:bg-blue-500/30 transition-all"></div>

                        <!-- Mobile Year -->
                        <div class="md:hidden text-xs font-mono text-blue-500 mb-2">{{ exp.period }}</div>

                        <!-- Header -->
                        <div class="flex items-start justify-between mb-4 relative z-10">
                            <div>
                                <h3 class="text-2xl font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">{{ exp.company }}</h3>
                                <div class="text-sm text-gray-400 font-medium">{{ exp.role }}</div>
                            </div>
                            <!-- Tech Stack (Right Top) -->
                             <div class="flex gap-1 flex-wrap justify-end max-w-[120px]">
                                <span v-for="t in exp.techStack?.slice(0,3)" :key="t" class="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-gray-500 border border-white/5">
                                    {{ t }}
                                </span>
                            </div>
                        </div>

                        <!-- Body -->
                        <p class="text-gray-300 text-sm leading-relaxed mb-6 border-l-2 border-white/10 pl-4 group-hover:border-blue-500/50 transition-colors">
                            {{ exp.description }}
                        </p>

                        <!-- Key Achievements -->
                        <div class="space-y-2 relative z-10">
                            <div v-for="bullet in exp.bullets" :key="bullet" class="flex items-center gap-2 text-xs text-gray-400 group-hover:text-gray-300">
                                <span class="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span>
                                {{ bullet }}
                            </div>
                        </div>

                    </div>
                 </div>

            </div>
        </div>

        <!-- Footer -->
        <div class="mt-32 text-center text-gray-600 font-mono text-xs">
            <div class="mb-4">END OF CHRONICLE</div>
            <button class="px-6 py-2 border border-gray-800 rounded hover:bg-gray-800 transition-colors text-gray-400">
                DOWNLOAD FULL RESUME.PDF
            </button>
        </div>

    </div>
  </div>
</template>
