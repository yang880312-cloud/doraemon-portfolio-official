<script setup>
import { onMounted, onUnmounted, ref, computed, nextTick } from 'vue'
import { useDataStore } from '@/stores/dataStore'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useRouter } from 'vue-router'
import ExperienceCard from './ExperienceCard.vue'
import ProfileDashboard from './ProfileDashboard.vue'

gsap.registerPlugin(ScrollTrigger)

const store = useDataStore()
const router = useRouter()
const profile = computed(() => store.getProfile() || {})

// Ensure we have experiences (Mock Logic in Store handles this now, but fallback here just in case)
const experiences = computed(() => {
    return profile.value.experience || []
})

// Active Experience for Dashboard
const activeExperience = ref(null)

function goBack() {
    router.push('/')
}

onMounted(async () => {
    // Wait for data if needed
    if (experiences.value.length === 0) {
        await store.fetchProfile() // Trigger the mock injection
    }

    // Set initial active experience
    if (experiences.value.length > 0) {
        activeExperience.value = experiences.value[0]
    }

    await nextTick()

    // 1. Reveal Intro (Identity)
    gsap.from('.intro-content', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
    })

    // 2. Setup ScrollTriggers for Cards
    const cards = gsap.utils.toArray('.experience-wrapper')
    cards.forEach((cardWrapper, i) => {
        // Animation for Card Entrance
        gsap.from(cardWrapper.querySelector('.experience-card'), {
            scrollTrigger: {
                trigger: cardWrapper,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            scale: 0.95,
            duration: 0.6,
            ease: "back.out(1.7)"
        })

        // Logic for Dashboard Linkage (Center of Viewport)
        ScrollTrigger.create({
            trigger: cardWrapper,
            start: "top center",
            end: "bottom center",
            onEnter: () => { activeExperience.value = experiences.value[i] },
            onEnterBack: () => { activeExperience.value = experiences.value[i] }
        })
    })

    // Background Parallax
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

    // Satellite Animation
    gsap.to('.satellite', {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'linear'
    })
})
</script>

<template>
  <div class="time-machine min-h-screen bg-[#050505] text-white relative font-sans overflow-x-hidden selection:bg-[#42b883] selection:text-black">

    <!-- 1. Background -->
    <div class="fixed inset-0 z-0 pointer-events-none">
        <div class="stars-bg absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-black via-[#050505] to-black opacity-90"></div>
        <!-- Cyber Grid -->
        <div class="absolute inset-0 opacity-[0.03]" :style="{
            backgroundImage: 'linear-gradient(#42b883 1px, transparent 1px), linear-gradient(90deg, #42b883 1px, transparent 1px)',
            backgroundSize: '50px 50px'
        }"></div>
    </div>

    <!-- 2. Sticky HUD (Nav) -->
    <div class="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-black/80 backdrop-blur-md border-b border-white/5">
        <button @click="goBack" class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <span class="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center group-hover:bg-[#42b883] group-hover:border-[#42b883] group-hover:text-black font-bold text-lg">←</span>
            <span class="text-xs font-mono tracking-widest hidden md:inline group-hover:text-[#42b883]">RETURN_LOBBY</span>
        </button>
        <div class="flex items-center gap-4">
             <div class="hidden md:flex items-center gap-2 text-xs font-mono text-[#42b883]">
                <span class="w-2 h-2 rounded-full bg-[#42b883] animate-pulse"></span>
                SYSTEM: OPTIMIZED
             </div>
             <a href="mailto:doraemon@future.com" class="px-4 py-1.5 bg-[#42b883]/10 hover:bg-[#42b883]/20 border border-[#42b883]/50 text-[#42b883] text-xs font-bold rounded shadow-[0_0_15px_rgba(66,184,131,0.2)] transition-all active:scale-95">
                INIT_CONTACT
             </a>
        </div>
    </div>

    <!-- 3. Scroll Content -->
    <div class="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pb-32 pt-28">

        <!-- INTRO MODULE (Identity Satellites) -->
        <div class="intro-content flex flex-col items-center text-center mb-32 relative">
            <!-- Avatar with Satellites -->
            <div class="relative w-40 h-40 md:w-48 md:h-48 mb-8">
                <!-- Satellite Track -->
                <div class="satellite absolute inset-[-40px] border border-white/10 rounded-full border-dashed animate-[spin_20s_linear_infinite]">
                    <div class="absolute top-1/2 -right-2 w-3 h-3 bg-[#42b883] rounded-full shadow-[0_0_10px_#42b883]"></div>
                </div>
                 <div class="satellite absolute inset-[-20px] border border-white/5 rounded-full border-dashed animate-[spin_15s_linear_infinite_reverse]">
                    <div class="absolute bottom-0 left-10 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_blue]"></div>
                    <!-- Floating Tag -->
                    <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-black/80 border border-white/20 px-2 py-0.5 rounded text-[10px] text-gray-300 whitespace-nowrap">
                        AI PM
                    </div>
                </div>

                <!-- Main Avatar -->
                <div class="w-full h-full rounded-full border-4 border-[#42b883]/20 p-1 relative z-10 bg-black">
                     <img :src="profile.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dora'" class="w-full h-full rounded-full object-cover filter brightness-110 contrast-125" />
                     <!-- Glitch Overlay (Optional) -->
                     <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-[#42b883]/20 to-transparent opacity-30"></div>
                </div>
            </div>

            <h1 class="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                {{ profile.name || 'LOADING_IDENTITY...' }}
            </h1>
            <div class="flex flex-wrap justify-center gap-3">
                 <span v-for="skill in (profile.skills || ['Vibe Coder', 'System Architect'])" :key="skill"
                       class="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-400 font-mono">
                    {{ skill }}
                 </span>
            </div>
        </div>


        <!-- MAIN SPLIT LAYOUT -->
        <div class="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-12 relative">

            <!-- LEFT: Timeline Log -->
            <div class="relative">
                <!-- Continuous Time Track Line -->
                <div class="absolute left-6 md:left-[27px] top-6 bottom-0 w-px bg-gradient-to-b from-[#42b883]/50 via-[#42b883]/20 to-transparent hidden md:block"></div>

                <div v-for="(exp, index) in experiences" :key="exp.id || index" class="experience-wrapper relative pl-0 md:pl-20 mb-8">

                    <!-- Mobile Year Marker -->
                    <div class="md:hidden text-[#42b883] font-mono text-sm mb-2 pl-1">{{ exp.period }}</div>

                    <!-- Desktop Year Marker (Absolute) -->
                    <div class="hidden md:flex absolute left-[-80px] top-8 w-24 justify-end">
                         <span class="font-mono text-xs text-[#42b883]/60 bg-black/80 px-1 border border-[#42b883]/20 rounded">
                             {{ exp.period?.split(' ')[0] }}
                         </span>
                    </div>

                    <ExperienceCard :experience="exp" :index="index" />
                </div>

                <!-- End Marker -->
                 <div class="hidden md:flex absolute left-[22px] bottom-0 w-3 h-3 bg-[#42b883] rounded-full shadow-[0_0_10px_#42b883]"></div>
            </div>

            <!-- RIGHT: Sticky Dashboard -->
            <div class="hidden lg:block">
                <div class="sticky top-24">
                     <ProfileDashboard :experience="activeExperience" />
                </div>
            </div>

            <!-- Mobile Dashboard (Sticky Bottom or Stacked Top?) -->
            <!-- Let's put a simplified version at bottom for mobile? No, user said card insert or bottom. -->
            <!-- For now, we rely on the stacked cards being rich enough, maybe just show stats in card for mobile? -->
            <!-- User requirement: "Mobile: Dashboard shrinks and fixed at bottom OR inserts as card". -->
            <!-- Let's try inserting it as a sticky bottom bar for mobile -->
            <div class="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-lg border-t border-[#42b883]/30 z-40">
                 <div class="flex justify-between items-center">
                      <div>
                          <div class="text-[10px] text-gray-400 uppercase">Current Focus</div>
                          <div class="text-sm font-bold text-white max-w-[150px] truncate">{{ activeExperience?.role || 'SCANNING' }}</div>
                      </div>
                      <div class="text-right">
                           <div class="text-[10px] text-gray-400 uppercase">Growth</div>
                           <div class="text-xl font-mono text-[#42b883]">{{ activeExperience?.growth?.value || 0 }}%</div>
                      </div>
                 </div>
            </div>
        </div>

    </div>
  </div>
</template>

<style scoped>
/* Gradient Text Support */
.text-neon-gradient {
    background: linear-gradient(to right, #42b883, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
