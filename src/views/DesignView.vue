<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '@/stores/dataStore'
import FluidCursor from '@/components/Design/FluidCursor.vue'
import ZeroGGrid from '@/components/Design/ZeroGGrid.vue'
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

    <!-- Background Ambience (Subtle Galaxy Feel) -->
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(30,30,40,0.4)_0%,rgba(0,0,0,0)_60%)] pointer-events-none"
    ></div>

    <!-- Zero Gravity Gallery Grid -->
    <ZeroGGrid :items="designProjects" @item-click="openProject" />

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
/* Hide default cursor globally within this view */
div {
  cursor: none;
}
</style>
