<script setup>
import { computed, onMounted, ref } from 'vue'
import { useDataStore } from '@/stores/dataStore'
import WarpTunnelEnvironment from '@/components/Design/WarpTunnelEnvironment.vue'
import ZeroGGrid from '@/components/Design/ZeroGGrid.vue'
import DesignProjectModal from '@/components/Design/DesignProjectModal.vue'

const store = useDataStore()
const selectedProject = ref(null)
const isModalOpen = ref(false)

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
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-transparent text-white selection:bg-pink-500 selection:text-white">
    <!-- BACKGROUND: The Time Warp Tunnel -->
    <WarpTunnelEnvironment />

    <!-- FOREGROUND: Content Grid -->
    <div class="relative z-10 container mx-auto px-4 py-20 min-h-screen flex flex-col">

      <!-- Header Area -->
      <header class="mb-16 text-center space-y-4 relative">
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          VISUAL<br/>ARCHIVE
        </h1>
        <p class="text-blue-300/80 font-mono tracking-[0.5em] text-xs uppercase scale-y-75 transform">
          FUTURE AESTHETICS // COLLECTION
        </p>
      </header>

      <!-- Zero-G Gallery Grid -->
      <ZeroGGrid :items="designProjects" @item-click="openProject" />

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
  width: 0px;
  background: transparent;
}
</style>
