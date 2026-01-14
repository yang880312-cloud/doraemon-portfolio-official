<script setup>
import { RouterView } from 'vue-router'
import { useDimensionStore } from '@/stores/dimension'
import { storeToRefs } from 'pinia'
import NavigationDock from '@/components/Global/NavigationDock.vue'
import WelcomeLoader from '@/components/Global/WelcomeLoader.vue'
import { ref } from 'vue'

const loading = ref(true)
const dimensionStore = useDimensionStore()
const { currentDimension } = storeToRefs(dimensionStore)
</script>

<template>
  <main class="w-full h-full relative overflow-hidden bg-void-black text-white">
    <WelcomeLoader v-if="loading" @finished="loading = false" />
    
    <!-- Router View handles the current page/dimension -->
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>

    <!-- Global Dock (Always present but conditionally visible/styled) -->
    <NavigationDock />
    
    <!-- Global Overlay for transitions if needed -->
    <div id="transition-overlay" class="pointer-events-none fixed inset-0 z-50"></div>
  </main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
