<script setup>
import FluidCursor from '@/components/Design/FluidCursor.vue'
import InfiniteMenu from '@/components/Design/InfiniteMenu.vue'
import designData from '@/data/design_data.json'
</script>

<template>
  <div class="relative w-full h-screen bg-[#050505] overflow-hidden">
    <!-- Custom Jelly Cursor -->
    <FluidCursor />

    <!-- Background Ambience -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1)_0%,rgba(0,0,0,0)_70%)] animate-pulse"></div>

    <!-- Header -->
    <div class="absolute top-8 left-8 z-10 pointer-events-none">
      <h2 class="text-xs font-mono text-purple-500 tracking-[0.5em] mb-2">DIMENSION 03</h2>
      <h1 class="text-5xl font-black tracking-tighter text-white">DESIGN <span class="text-purple-500 italic">MAGIC</span></h1>
    </div>

    <!-- Infinite Scroll Gallery -->
    <InfiniteMenu :items="designData" />
    
    <!-- Instruction -->
    <div class="absolute bottom-24 left-1/2 -translate-x-1/2 text-gray-500 text-xs tracking-widest animate-bounce pointer-events-none">
      SCROLL TO EXPLORE
    </div>
  </div>
</template>

<style scoped>
/* Hide default cursor */
div {
  cursor: none;
}
</style>
