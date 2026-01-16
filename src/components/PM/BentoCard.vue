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
    class="group relative overflow-hidden rounded-3xl bg-white border-4 border-[#1e3a8a] transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(30,58,138,1)] active:translate-y-0 active:shadow-none"
    :class="{
      'col-span-1 row-span-1': size === 'normal',
      'col-span-1 md:col-span-2 row-span-2': size === 'large',
      'col-span-1 row-span-2': size === 'tall'
    }"
  >
    <!-- Background Image -->
    <div class="absolute inset-0 z-0 bg-[#f0f9ff]">
      <img :src="project.thumbnail" class="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" alt="Gadget Thumbnail">
      <!-- Gradient Overlay for distinct text -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/90 via-transparent to-transparent opacity-80"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col justify-end h-full p-6">

      <!-- Category Badge -->
      <div class="flex gap-2 mb-2">
        <span class="px-3 py-1 text-[10px] font-black tracking-widest border border-white/30 bg-[#ef4444] text-white rounded-full shadow-sm uppercase">
          {{ project.category }}
        </span>
      </div>

      <h3 class="text-2xl md:text-3xl font-black text-white mb-1 tracking-tighter drop-shadow-md group-hover:text-[#fcd34d] transition-colors">
        {{ project.title }}
      </h3>
      <p class="text-sm text-blue-100 font-medium line-clamp-2 md:line-clamp-3 mb-4 opacity-90 group-hover:opacity-100">
        {{ project.description }}
      </p>

      <!-- Metrics Badge (Simplified) -->
      <div class="flex gap-4 pt-4 border-t border-white/20">
        <div v-for="(val, key) in project.pm_metrics" :key="key" class="text-center group-hover:scale-110 transition-transform bg-white/10 rounded-lg p-1 px-2 backdrop-blur-sm">
          <div class="text-[8px] text-blue-200 uppercase font-bold tracking-wider opacity-80">{{ key }}</div>
          <div class="text-xs font-black font-mono text-white">{{ val }}</div>
        </div>
      </div>

    </div>

    <!-- Decorator: Bell Icon or Pocket -->
    <div class="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#fcd34d] border-2 border-[#1e3a8a] shadow-sm flex items-center justify-center animate-bounce duration-[2000ms]">
      <div class="w-4 h-1 bg-[#1e3a8a] rounded-full opacity-50"></div>
    </div>

  </div>
</template>
