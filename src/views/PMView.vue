<script setup>
import { ref, computed, onMounted } from 'vue'
import BentoCard from '@/components/PM/BentoCard.vue'
import PMProjectModal from '@/components/PM/PMProjectModal.vue'
import FlashlightCursor from '@/components/PM/FlashlightCursor.vue'
import { useDataStore } from '@/stores/dataStore'
import { useHead } from '@vueuse/head'

useHead({
  title: '任務控制中心 (Mission Control)',
  meta: [
    { name: 'description', content: '哆啦A夢的祕密道具管理系統。查看開發中的專案與技術細節。 (Project Management)' },
  ]
})

const isModalOpen = ref(false)
const selectedProject = ref(null)
const selectedIndex = ref(0) // Track index for numbering

const dataStore = useDataStore()

// Fetch data on mount
onMounted(() => {
  dataStore.fetchProjects()
})

// Unified Projects Data (Mapped from DB)
const projects = computed(() => {
  const pmProjects = dataStore.projects.filter(p => p.type === 'PM')

  return pmProjects.map(p => {
    // Unpack nested fields from pm_metrics if they exist (backward compatibility for Seeder hack)
    const rawMetrics = p.pm_metrics || {}
    const packedDetails = rawMetrics._details
    const packedColor = rawMetrics._theme_color

    // Clean metrics for display (remove internal storage keys)
    // eslint-disable-next-line no-unused-vars
    const { _details, _theme_color, ...cleanMetrics } = rawMetrics

    // Fallback: If no thumbnail, use the first image in gallery
    const displayThumbnail = p.thumbnail || (p.images && p.images.length > 0 ? p.images[0] : '')

    return {
      ...p,
      thumbnail: displayThumbnail, // Explicitly override
      pm_metrics: cleanMetrics,
      // Ensure we fallback to the unpacked values or existing ones
      details: packedDetails || p.details || {},
      theme_color: packedColor || p.theme_color || '#1e3a8a'
    }
  })
})

function openProject(project, index) {
  selectedProject.value = project
  selectedIndex.value = index
  isModalOpen.value = true
}

// Determine card size: Only the first one is large
function getCardSize(index) {
  if (index === 0) return 'large'
  return 'normal'
}
</script>

<template>
  <div class="relative w-full h-full bg-[#f0f8ff] text-[#1e3a8a] p-4 pt-20 md:p-8 md:pt-24 overflow-y-auto cursor-none">
    <!-- Custom Cursor -->
    <FlashlightCursor />
    <!-- Header Section -->
    <header
      class="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-end border-b-4 border-[#1e3a8a] pb-6"
    >
      <div>
        <h1 class="text-5xl md:text-7xl font-black tracking-tighter mb-2 text-[#1e3a8a] drop-shadow-sm">
          祕密 <span class="text-[#ef4444]">道具倉庫</span>
        </h1>
        <p class="text-[#1e3a8a]/70 font-medium max-w-lg text-lg">
          用未來邏輯解決現實世界的問題。
          <br /><span class="text-xs uppercase tracking-widest bg-[#1e3a8a] text-white px-2 py-1 rounded-full mt-2 inline-block">22世紀百貨公司</span>
        </p>
      </div>
      <div class="text-right font-bold font-mono text-sm text-[#ef4444] mt-4 md:mt-0 bg-white px-4 py-2 rounded-xl border-2 border-[#1e3a8a] shadow-[4px_4px_0px_rgba(30,58,138,1)]">
        系統狀態：線上 <br />
        道具總數：<span v-if="dataStore.isLoading" class="animate-pulse">掃描中...</span>
        <span v-else>{{ projects.length }}</span>
      </div>
    </header>

    <!-- Bento Grid Canvas -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px] mb-20 pb-20">
      <BentoCard
        v-for="(project, index) in projects"
        :key="project.id"
        :project="project"
        :size="getCardSize(index)"
        class="cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
        @click="openProject(project, index)"
      />
    </div>

    <!-- Project Detail Modal -->
    <PMProjectModal :isOpen="isModalOpen" :project="selectedProject" :index="selectedIndex" @close="isModalOpen = false" />
  </div>
</template>

<style scoped>
/* Hide default cursor only in this view */
@media (min-width: 768px) {
  div {
    cursor: none;
  }
}
</style>
