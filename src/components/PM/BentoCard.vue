<script setup>
import { Bell } from 'lucide-vue-next'

defineProps({
  project: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    default: 'normal' // 'normal' | 'large'
  }
})
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-3xl bg-white border-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(0,0,0,0.2)] active:translate-y-0 active:shadow-none"
    :style="{ borderColor: project.theme_color }"
    :class="{
      'col-span-1 row-span-1': size === 'normal',
      'col-span-1 md:col-span-2 row-span-2': size === 'large'
    }"
  >
    <!-- Background Image (Hidden by default, revealed on hover) -->
    <div
      class="absolute inset-0 z-0"
      :style="{ backgroundColor: project.theme_color }"
    >
      <img :src="project.thumbnail" class="w-full h-full object-cover opacity-10 blur-sm grayscale transition-all duration-500 group-hover:opacity-100 group-hover:blur-0 group-hover:grayscale-0" alt="Gadget Thumbnail">

      <!-- Gradient Overlay: Solid Color -> Fade Out on Hover -->
      <!-- We use a pseudo-element logic via style binding for the gradient to match the theme color -->
      <div
        class="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
        :style="{ background: `linear-gradient(to top, ${project.theme_color} 0%, ${project.theme_color}CC 60%, ${project.theme_color}66 100%)` }"
      ></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col justify-end h-full p-5 md:p-6">

      <!-- Category Badge -->
      <div class="flex gap-2 mb-2">
        <span class="px-3 py-1 text-[10px] font-black tracking-widest border border-white/30 bg-black/20 text-white rounded-full shadow-sm uppercase backdrop-blur-md">
          {{ project.category }}
        </span>
      </div>

      <h3 class="text-xl md:text-2xl font-black text-white mb-1 tracking-tighter drop-shadow-md group-hover:drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all leading-tight">
        {{ project.title }}
      </h3>
      <p class="text-xs md:text-sm text-white/90 font-medium line-clamp-2 mb-3 opacity-90 group-hover:opacity-100 group-hover:drop-shadow-sm">
        {{ project.description }}
      </p>

      <!-- Metrics Badge (Simplified) -->
      <div class="flex gap-3 pt-3 border-t border-white/20">
        <div v-for="(val, key) in project.pm_metrics" :key="key" class="text-center group-hover:scale-110 transition-transform bg-white/10 rounded-lg p-1 px-2 backdrop-blur-sm border border-white/10">
          <div class="text-[8px] text-white/80 uppercase font-bold tracking-wider opacity-90">{{ key }}</div>
          <div class="text-[10px] md:text-xs font-black font-mono text-white">{{ val }}</div>
        </div>
      </div>

    </div>

    <!-- Decorator: Bell Icon -->
    <div
      class="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-white/50 shadow-sm flex items-center justify-center animate-bounce duration-[2000ms] text-white"
      :style="{ backgroundColor: project.theme_color }"
    >
      <Bell :size="16" stroke-width="3" />
    </div>

  </div>
</template>
