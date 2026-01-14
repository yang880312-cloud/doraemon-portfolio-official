<script setup>
defineProps({
  project: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    default: 'normal' // 'normal' | 'large' | 'tall'
  }
})
</script>

<template>
  <div 
    class="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/50 hover:bg-white/10"
    :class="{
      'col-span-1 row-span-1': size === 'normal',
      'col-span-2 row-span-2': size === 'large',
      'col-span-1 row-span-2': size === 'tall'
    }"
  >
    <!-- Image BG (Dimmed) -->
    <div class="absolute inset-0 z-0">
      <img :src="project.thumbnail" class="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500 grayscale group-hover:grayscale-0" alt="Project Thumbnail">
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col justify-end h-full p-6">
      
      <!-- Metrics Badge -->
      <div class="flex gap-2 mb-2">
        <span class="px-2 py-1 text-[10px] font-mono border border-blue-500/30 bg-blue-500/10 text-blue-300 rounded">
          {{ project.category }}
        </span>
      </div>

      <h3 class="text-2xl font-bold text-white mb-1 tracking-tight">{{ project.title }}</h3>
      <p class="text-sm text-gray-400 mb-4 line-clamp-2">{{ project.description }}</p>

      <!-- Data Details (Visible on hover) -->
      <div class="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <div v-for="(val, key) in project.pm_metrics" :key="key" class="text-center">
          <div class="text-[10px] text-gray-500 uppercase">{{ key }}</div>
          <div class="text-xs font-mono text-blue-300">{{ val }}</div>
        </div>
      </div>
      
    </div>
    
    <!-- Decorator -->
    <div class="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500/50 animate-pulse"></div>

  </div>
</template>
