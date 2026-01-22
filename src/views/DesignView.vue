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
  <div class="relative min-h-screen overflow-y-auto overflow-x-hidden bg-transparent text-white selection:bg-pink-500 selection:text-white custom-scroll">
    <!-- BACKGROUND: The Time Warp Tunnel -->
    <WarpTunnelEnvironment />

    <!-- FOREGROUND: Content Grid -->
    <div class="relative z-10 container mx-auto px-4 py-20 min-h-screen flex flex-col">

      <!-- Header Area: Secret Gadget Warehouse Style -->
      <header class="mb-24 text-center relative z-20 transform-style-3d">
        <!-- Main Title -->
        <h1 class="relative inline-block">
          <span class="block text-6xl md:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#00A0E9] to-[#0089C9] drop-shadow-[4px_4px_0px_#fff] filter mb-2 text-outline-white" style="font-family: 'Noto Sans TC', sans-serif;">
            秘密道具倉庫
          </span>
          <!-- Subtitle Badge -->
          <span class="absolute -bottom-6 -right-4 bg-[#EE3F4A] text-white text-xl font-bold px-4 py-1 rounded-full border-4 border-white shadow-lg rotate-[-5deg]">
            SECRET GADGETS
          </span>
        </h1>

        <!-- Description -->
        <p class="mt-8 text-blue-200/80 font-bold tracking-widest text-sm bg-black/30 inline-block px-6 py-2 rounded-full backdrop-blur-sm border border-white/20">
          用未來邏輯解決現實世界的問題 // 22世紀百貨公司
        </p>
      </header>

      <!-- Zero-G Gallery Grid with Tunnel Perspective -->
      <div class="tunnel-grid-wrapper">
         <ZeroGGrid :items="designProjects" @item-click="openProject" />
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
</style>
