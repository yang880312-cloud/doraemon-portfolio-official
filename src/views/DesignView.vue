<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/dataStore'
import ZeroGGrid from '@/components/Design/ZeroGGrid.vue'
import DesignProjectModal from '@/components/Design/DesignProjectModal.vue'

const router = useRouter()
const dataStore = useDataStore()

// Ensure data is loaded
dataStore.fetchProjects()

// State
const designProjects = computed(() => dataStore.designProjects)
const selectedProject = ref(null)
const isModalOpen = ref(false)
const isDealt = ref(false)

function openProject(project) {
  selectedProject.value = project
  isModalOpen.value = true
}

function closeProject() {
  isModalOpen.value = false
  setTimeout(() => {
    selectedProject.value = null
  }, 300)
}

function switchProject(project) {
    selectedProject.value = project
}
</script>

<template>
  <!-- Simplified Plan B Layout: Standard Scrolling Page -->
  <div class="relative min-h-screen w-full bg-[#050505] pb-32">

    <!-- Header Area -->
    <div class="container mx-auto px-4 pt-20 pb-10 text-center relative z-20">
        <h1 class="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 tracking-tighter mb-4 glitch-text" data-text="DESIGN GALLERY">
            DESIGN GALLERY
        </h1>
        <p class="text-blue-400 font-mono tracking-[0.5em] text-sm uppercase opacity-80">
            Select Work // Visual Experiments
        </p>
    </div>

    <!-- Main Grid Content -->
    <div class="relative z-10 container mx-auto px-4">
        <!-- Pass isDealt event from Grid to show header or generic -->
        <ZeroGGrid
            :items="designProjects"
            @item-click="openProject"
            @deal-start="isDealt = true"
        />
    </div>

    <!-- Project Modal -->
    <DesignProjectModal
      :isOpen="isModalOpen"
      :project="selectedProject"
      :siblings="designProjects"
      @close="closeProject"
      @switch="switchProject"
    />
  </div>
</template>

<style scoped>
/* Basic Glitch Effect for Title */
.glitch-text {
  position: relative;
}
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #050505;
}
.glitch-text::before {
  left: 2px;
  text-shadow: -1px 0 #00ffff;
  clip-path: inset(20% 0 30% 0);
  animation: glitch-anim-1 2s infinite linear alternate-reverse;
}
.glitch-text::after {
  left: -2px;
  text-shadow: 1px 0 #ff00ff;
  clip-path: inset(40% 0 60% 0);
  animation: glitch-anim-2 2s infinite linear alternate-reverse;
}

@keyframes glitch-anim-1 {
  0% { clip-path: inset(20% 0 30% 0); }
  20% { clip-path: inset(60% 0 10% 0); }
  40% { clip-path: inset(40% 0 50% 0); }
  60% { clip-path: inset(80% 0 5% 0); }
  80% { clip-path: inset(10% 0 70% 0); }
  100% { clip-path: inset(30% 0 20% 0); }
}
@keyframes glitch-anim-2 {
  0% { clip-path: inset(10% 0 60% 0); }
  20% { clip-path: inset(30% 0 20% 0); }
  40% { clip-path: inset(70% 0 40% 0); }
  60% { clip-path: inset(20% 0 50% 0); }
  80% { clip-path: inset(50% 0 10% 0); }
  100% { clip-path: inset(0% 0 90% 0); }
}
</style>
