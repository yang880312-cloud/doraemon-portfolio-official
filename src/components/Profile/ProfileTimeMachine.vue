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

// Ensure we have experiences
const experiences = computed(() => {
    return profile.value.experience || []
})

// Navigation Back
function goBack() {
    router.push('/')
}

onMounted(() => {
    // Basic Fade In for cards
    // We use a slight delay to ensure DOM is ready
    setTimeout(() => {
        const eras = gsap.utils.toArray('.era-card')
        eras.forEach((card) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%", // Trigger earlier
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            })
        })
    }, 100)
})
</script>

<template>
  <div class="time-machine min-h-screen bg-black text-white relative">

    <!-- 1. Fixed Background (Time Tunnel) -->
    <div class="fixed inset-0 z-0 bg-[#050505] pointer-events-none">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black"></div>
        <!-- Tunnel Grid -->
        <div class="absolute inset-0 opacity-20" :style="{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
        }"></div>
        <!-- Stars -->
         <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>
    </div>

    <!-- 2. Sticky Navigation (Top) -->
    <div class="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
        <button @click="goBack" class="pointer-events-auto flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
            <span class="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10">←</span>
            <span class="text-sm tracking-widest font-mono">BACK_TO_LOBBY</span>
        </button>
        <div class="font-mono text-xs text-blue-500 animate-pulse">TIME_MACHINE // ACTIVE</div>
    </div>

    <!-- 3. Scroll Content -->
    <div class="relative z-10 px-6 py-32 max-w-5xl mx-auto flex flex-col gap-[30vh]">

        <!-- Header -->
        <div class="text-center mb-20 space-y-4">
            <div class="inline-block px-3 py-1 border border-blue-500/30 rounded-full text-blue-400 text-xs tracking-[0.2em]">IDENTIFIED: {{ profile.name }}</div>
            <h1 class="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">
                CHRONICLE
            </h1>
            <p class="text-gray-400 max-w-xl mx-auto font-mono text-sm leading-relaxed">
                Initializing temporal scan...<br>
                Retrieving career trajectory and milestone data...
            </p>
        </div>

        <!-- Eras Loop -->
        <div v-for="(exp, index) in experiences" :key="index" class="era-section relative grid grid-cols-1 md:grid-cols-[1fr_2px_1fr] gap-8 md:gap-0">

            <!-- Left Side (Year Marker) -->
            <div class="relative flex flex-col items-end md:pr-12 text-right">
                <div class="sticky top-1/2 -translate-y-1/2 transition-opacity duration-500">
                    <h2 class="text-6xl md:text-8xl font-black text-gray-800/50 select-none">
                        {{ exp.period.split(/[ -]/)[0] }}
                    </h2>
                    <div class="text-sm font-mono text-blue-500 mt-2 tracking-widest">{{ exp.period }}</div>
                </div>
            </div>

            <!-- Center Line -->
            <div class="hidden md:block w-0.5 bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0 relative">
                <!-- Node Dot -->
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] z-20 sticky top-1/2"></div>
            </div>

            <!-- Right Side (Card) -->
            <div class="flex flex-col justify-center py-20 md:pl-12">
                <div class="era-card bg-gray-900/60 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl shadow-2xl relative group hover:border-blue-500/50 transition-colors">

                    <!-- Glow Line -->
                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>

                    <!-- Company & Role -->
                    <div class="mb-6">
                        <div class="text-xs text-gray-500 uppercase tracking-widest mb-2">{{ exp.role }}</div>
                        <h3 class="text-3xl font-bold text-white mb-1">{{ exp.company }}</h3>
                        <div class="flex gap-2 mt-3">
                            <span v-for="tech in exp.techStack?.slice(0,3)" :key="tech" class="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-400 border border-white/5">{{ tech }}</span>
                        </div>
                    </div>

                    <!-- Description -->
                    <p class="text-gray-400 leading-relaxed text-sm mb-6 border-l-2 border-gray-700 pl-4">
                        {{ exp.description }}
                    </p>

                    <!-- Stats / Bullets -->
                    <ul class="space-y-2">
                        <li v-for="bullet in exp.bullets" :key="bullet" class="text-sm text-gray-300 flex items-start gap-2">
                            <span class="text-blue-500 scale-75 mt-1">▶</span>
                            {{ bullet }}
                        </li>
                    </ul>

                    <!-- Image Overlay (Optional) -->
                    <div v-if="exp.image" class="absolute -z-10 top-0 right-0 w-32 h-32 opacity-10 bg-no-repeat bg-contain bg-right-top pointer-events-none mix-blend-screen"
                         :style="{ backgroundImage: `url(${exp.image})` }">
                    </div>
                </div>
            </div>

        </div>

        <!-- Footer -->
        <div class="h-[20vh] flex items-center justify-center text-gray-600 font-mono text-xs">
            END OF RECORD
        </div>

    </div>
  </div>
</template>
