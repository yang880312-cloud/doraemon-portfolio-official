<script setup>
import { ref } from 'vue'
import DataCursor from '@/components/PM/DataCursor.vue'
import BentoCard from '@/components/PM/BentoCard.vue'
import PMProjectModal from '@/components/PM/PMProjectModal.vue'
import portfolioData from '@/data/portfolio.json'

const isModalOpen = ref(false)
const selectedProject = ref(null)

function openProject(project) {
  console.log('Opening PM Project:', project)
  selectedProject.value = project
  isModalOpen.value = true
}

const projects = ref(portfolioData)

// Determine card size based on ID or custom logic
function getCardSize(index) {
  if (index === 0) return 'large'
  if (index === 3) return 'tall'
  return 'normal'
}
</script>

<template>
  <div class="relative w-full min-h-screen bg-[#f0f8ff] text-[#1e3a8a] p-4 pt-20 md:p-8 md:pt-24 overflow-y-auto">
    <!-- Custom Cursor -->
    <DataCursor />

    <!-- Header Section -->
    <header
      class="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-end border-b-4 border-[#1e3a8a] pb-6"
    >
      <div>
        <h1 class="text-5xl md:text-7xl font-black tracking-tighter mb-2 text-[#1e3a8a] drop-shadow-sm">
          SECRET <span class="text-[#ef4444]">GADGETS</span>
        </h1>
        <p class="text-[#1e3a8a]/70 font-medium max-w-lg text-lg">
          Solving real-world problems with futuristic logic.
          <br /><span class="text-xs uppercase tracking-widest bg-[#1e3a8a] text-white px-2 py-1 rounded-full mt-2 inline-block">22nd Century Department Store</span>
        </p>
      </div>
      <div class="text-right font-bold font-mono text-sm text-[#ef4444] mt-4 md:mt-0 bg-white px-4 py-2 rounded-xl border-2 border-[#1e3a8a] shadow-[4px_4px_0px_rgba(30,58,138,1)]">
        SYSTEM: ONLINE <br />
        GADGETS: {{ projects.length }}
      </div>
    </header>

    <!-- Bento Grid Canvas -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px] mb-20">
      <BentoCard
        v-for="(project, index) in projects"
        :key="project.id"
        :project="project"
        :size="getCardSize(index)"
        class="cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
        @click="openProject(project)"
      />
    </div>

    <!-- Project Detail Modal -->
    <PMProjectModal :isOpen="isModalOpen" :project="selectedProject" @close="isModalOpen = false" />
  </div>
</template>

<style scoped>
/* Hide default cursor only in this view */
div {
  cursor: none;
}
</style>
