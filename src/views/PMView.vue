<script setup>
import { ref } from 'vue'
import DataCursor from '@/components/PM/DataCursor.vue'
import BentoCard from '@/components/PM/BentoCard.vue'
import portfolioData from '@/data/portfolio.json'

const projects = ref(portfolioData)

// Determine card size based on ID or custom logic
function getCardSize(index) {
  if (index === 0) return 'large'
  if (index === 3) return 'tall'
  return 'normal'
}
</script>

<template>
  <div class="relative w-full min-h-screen bg-[#0a0a0f] text-white p-8 pt-24 overflow-y-auto">
    <!-- Custom Cursor -->
    <DataCursor />

    <!-- Header Section -->
    <header class="max-w-7xl mx-auto mb-12 flex justify-between items-end border-b border-white/10 pb-8">
      <div>
        <h1 class="text-5xl font-bold tracking-tighter mb-2">PM <span class="text-blue-500 font-mono">LOGIC</span></h1>
        <p class="text-gray-400 max-w-lg">
          Analyzing problems with data-driven precision.
          <br>Structuring chaos into actionable roadmaps.
        </p>
      </div>
      <div class="text-right font-mono text-sm text-blue-400/60 hidden md:block">
        SYSTEM STATUS: ONLINE <br>
        DIMENSION: 02
      </div>
    </header>

    <!-- Bento Grid Canvas -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px] mb-20">
      <BentoCard 
        v-for="(project, index) in projects" 
        :key="project.id"
        :project="project"
        :size="getCardSize(index)"
      />
    </div>

  </div>
</template>

<style scoped>
/* Hide default cursor only in this view */
div {
  cursor: none;
}
</style>
