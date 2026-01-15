<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '@/stores/dataStore'
import FluidCursor from '@/components/Design/FluidCursor.vue'
import BrickWall from '@/components/Design/BrickWall.vue'
import DesignProjectModal from '@/components/Design/DesignProjectModal.vue'

const store = useDataStore()
const selectedProject = ref(null)
const isModalOpen = ref(false)

// Fetch Data
onMounted(async () => {
  if (store.projects.length === 0) {
    await store.fetchProjects()
  }
})

// Filter Design Projects
const designProjects = computed(() => {
  return store.projects.filter((p) => p.type === 'DESIGN')
})

function openProject(project) {
  selectedProject.value = project
  isModalOpen.value = true
}
</script>

<template>
  <div class="relative w-full h-screen bg-[#050505] overflow-hidden">
    <!-- Custom Jelly Cursor -->
    <FluidCursor />

    <!-- Background Ambience -->
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1)_0%,rgba(0,0,0,0)_70%)] animate-pulse"
    ></div>

    <!-- Header -->
    <div
      class="absolute bottom-8 left-0 w-full text-center pointer-events-none z-10 opacity-50 mix-blend-difference"
    >
      <!-- Text Removed as per user request -->
    </div>

    <!-- Brick Wall Layout -->
    <BrickWall :items="designProjects" @item-click="openProject" />

    <DesignProjectModal
      :isOpen="isModalOpen"
      :project="selectedProject"
      :siblings="designProjects"
      @close="isModalOpen = false"
      @switch="openProject"
    />

    <!-- Instruction Removed -->
  </div>
</template>

<style scoped>
/* Hide default cursor */
div {
  cursor: none;
}
</style>
