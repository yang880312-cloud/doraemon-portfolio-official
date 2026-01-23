<script setup>
import { computed, onMounted, ref } from 'vue'
import { useDataStore } from '@/stores/dataStore'
import WarpTunnelEnvironment from '@/components/Design/WarpTunnelEnvironment.vue'
import ZeroGGrid from '@/components/Design/ZeroGGrid.vue'
import DesignProjectModal from '@/components/Design/DesignProjectModal.vue'
import FluidCursor from '@/components/Design/FluidCursor.vue'

const store = useDataStore()
const selectedProject = ref(null)
const isModalOpen = ref(false)
const isDealt = ref(false)

onMounted(async () => {
  if (store.projects.length === 0) {
    await store.fetchProjects()
  }
})

const designProjects = computed(() => {
  return store.projects.filter((p) => p.type === 'DESIGN')
})

function openProject(project) {
  selectedProject.value = project
  isModalOpen.value = true
}

// Force Rebuild: 2026-01-23 v3
</script>

<template>
  <div class="relative min-h-screen overflow-y-auto overflow-x-hidden bg-transparent text-white selection:bg-pink-500 selection:text-white custom-scroll">
    <!-- BACKGROUND: The Time Warp Tunnel -->
    <WarpTunnelEnvironment />
    <FluidCursor />

    <!-- FOREGROUND: Content Grid -->
    <div class="relative z-10 container mx-auto px-4 py-20 min-h-screen flex flex-col">

      <!-- Header Area: Paint World Gallery Style -->
      <!-- Only fade in when dealt to avoid visual clutter during deal intro -->
      <transition enter-active-class="transition duration-1000 ease-out" enter-from-class="opacity-0 translate-y-10" enter-to-class="opacity-100 translate-y-0">
        <header v-show="isDealt" class="mb-24 text-center relative z-20 transform-style-3d">
            <!-- Main Title -->
            <h1 class="relative inline-block hover:scale-105 transition-transform duration-300">
            <span class="block text-7xl md:text-9xl font-black tracking-tight mb-2 secret-gadget-title">
                繪世界藝廊
            </span>
            <!-- Subtitle Badge -->
            <span class="code-badge absolute -bottom-8 -right-8 bg-[#0247A2] text-white text-lg font-bold px-6 py-2 rounded-full border-[3px] border-white shadow-[4px_4px_0px_rgba(0,0,0,0.3)] rotate-[-8deg] tracking-widest z-10 w-max">
                PAINTED WORLD
            </span>
            </h1>

            <!-- Description -->
            <p class="mt-10 text-[#009EFF] font-bold tracking-widest text-sm md:text-base bg-white/95 inline-block px-8 py-3 rounded-full shadow-[0_0_20px_rgba(0,158,255,0.4)]">
            用未來邏輯解決現實世界的問題
            </p>
        </header>
      </transition>

      <!-- Zero-G Gallery Grid with Tunnel Perspective -->
      <div class="tunnel-grid-wrapper">
         <ZeroGGrid
            :items="designProjects"
            @item-click="openProject"
            @deal-start="isDealt = true"
         />
      </div>

    </div>

    <!-- Modals -->
    <DesignProjectModal
      :isOpen="isModalOpen"
      :project="selectedProject"
      :siblings="designProjects"
      @close="isModalOpen = false"
      @switch="openProject"
    />
  </div>
</template>

<style scoped>
/* Scrollbar Hiding for immersive feel */
::-webkit-scrollbar {
  width: 8px;
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.perspective-container {
  perspective: 1000px;
  perspective-origin: center center;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.tunnel-grid-wrapper {
  transform-style: preserve-3d;
  /* Slight tilt to simulate tunnel walls if ZeroGGrid pushes items */
  /* We can rely on ZeroGGrid's own transforms, or add a container tilt here */
  transform: rotateX(5deg);
  transition: transform 0.5s ease-out;
}
/* Font Import for Heavy Look */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@900&display=swap');

.secret-gadget-title {
  font-family: 'Noto Sans TC', sans-serif;
  color: #009EFF; /* Doraemon Blue */
  -webkit-text-stroke: 5px white;
  paint-order: stroke fill;
  text-shadow: 6px 6px 0px #0247A2; /* Hard Shadow */
  line-height: 1.1;
}

.code-badge {
  font-family: 'Noto Sans TC', sans-serif;
}
</style>
