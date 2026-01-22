<script setup>
import { computed, onMounted } from 'vue'
import { useDataStore } from '@/stores/dataStore'
import WarpTunnelEnvironment from '@/components/Design/WarpTunnelEnvironment.vue'
import ZeroGGrid from '@/components/Design/ZeroGGrid.vue'
import DesignProjectModal from '@/components/Design/DesignProjectModal.vue'

const store = useDataStore()

onMounted(async () => {
  if (store.projects.length === 0) {
    await store.fetchProjects()
  }
})

const designProjects = computed(() => {
  return store.projects.filter((p) => p.type === 'DESIGN')
})
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-black text-white selection:bg-pink-500 selection:text-white">
    <!-- BACKGROUND: The Time Warp Tunnel -->
    <WarpTunnelEnvironment />

    <!-- FOREGROUND: Content Grid -->
    <div class="relative z-10 container mx-auto px-4 py-20 min-h-screen flex flex-col">

      <!-- Header Area -->
      <header class="mb-16 text-center space-y-4 relative">
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
          DORAEMON<br/>DESIGN
        </h1>
        <p class="text-blue-300 font-mono tracking-widest text-sm uppercase">
          // Visual Archive // Time-Space Coordinates: 2112.09.03
        </p>
      </header>

      <!-- Zero-G Gallery Grid -->
      <ZeroGGrid :items="designProjects" />

    </div>

    <!-- Modals -->
    <DesignProjectModal />
  </div>
</template>

<style scoped>
/* Scrollbar Hiding for immersive feel */
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
</style>
