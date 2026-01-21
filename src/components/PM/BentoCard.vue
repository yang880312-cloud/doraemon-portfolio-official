<script setup>
import { Bell } from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    default: 'normal'
  }
})

const cardRef = ref(null)
const cursorX = ref(0)
const cursorY = ref(0)
const isHovering = ref(false)

function updateCursorPosition(e) {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  cursorX.value = e.clientX - rect.left
  cursorY.value = e.clientY - rect.top
  isHovering.value = true
}

function resetCursor() {
  isHovering.value = false
}
</script>

<template>
  <div
    ref="cardRef"
    class="group relative overflow-hidden rounded-3xl bg-white border-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(0,0,0,0.2)] active:translate-y-0 active:shadow-none bg-[#f8fafc]"
    :style="{ borderColor: project.theme_color }"
    :class="{
      'col-span-1 row-span-1': size === 'normal',
      'col-span-1 md:col-span-2 row-span-2': size === 'large'
    }"
    @mousemove="updateCursorPosition"
    @mouseleave="resetCursor"
  >
    <!-- Background Layer (Solid Color) -->
    <div
      class="absolute inset-0 z-0 opacity-100"
      :style="{ backgroundColor: project.theme_color }"
    ></div>

    <!-- Hidden Image Layer (Revealed by Flashlight Mask) -->
    <!-- We use mask-image to create the flashlight effect locally on the card -->
      class="absolute inset-0 z-10 pointer-events-none transition-opacity duration-200"
      :style="{
        opacity: isHovering ? 1 : 0,
        maskImage: isHovering ? `radial-gradient(circle 120px at ${cursorX}px ${cursorY}px, black 30%, transparent 100%)` : 'none',
        WebkitMaskImage: isHovering ? `radial-gradient(circle 120px at ${cursorX}px ${cursorY}px, black 30%, transparent 100%)` : 'none'
      }"
    >
      <img :src="project.thumbnail" class="w-full h-full object-cover" alt="Gadget Thumbnail">
    </div>

    <!-- Content (Always visible on top) -->
    <div class="relative z-20 flex flex-col justify-end h-full p-5 md:p-6 pointer-events-none">

      <!-- Category Badge -->
      <div class="flex gap-2 mb-2">
        <span class="px-3 py-1 text-[10px] font-black tracking-widest border border-black/10 bg-white/50 text-[#1e3a8a] rounded-full shadow-sm uppercase backdrop-blur-md">
          {{ project.category }}
        </span>
      </div>

      <h3 class="text-xl md:text-2xl font-black text-[#1e3a8a] mb-1 tracking-tighter drop-shadow-sm transition-all leading-tight group-hover:drop-shadow-[0_2px_0px_rgba(255,255,255,0.8)]">
        {{ project.title }}
      </h3>
      <p class="text-xs md:text-sm text-[#1e3a8a]/80 font-medium line-clamp-2 mb-3">
        {{ project.description }}
      </p>

      <!-- Metrics Badge -->
      <div class="flex gap-3 pt-3 border-t border-[#1e3a8a]/10">
        <div v-for="(val, key) in project.pm_metrics" :key="key" class="text-center group-hover:scale-110 transition-transform bg-white/40 rounded-lg p-1 px-2 backdrop-blur-sm border border-white/20">
          <div class="text-[8px] text-[#1e3a8a]/70 uppercase font-bold tracking-wider opacity-90">{{ key }}</div>
          <div class="text-[10px] md:text-xs font-black font-mono text-[#ef4444]">{{ val }}</div>
        </div>
      </div>

    </div>

    <!-- Decorator: Bell Icon -->
    <div
      class="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-white/50 shadow-sm flex items-center justify-center animate-bounce duration-[2000ms] text-white z-20"
      :style="{ backgroundColor: project.theme_color }"
    >
      <Bell :size="16" stroke-width="3" />
    </div>

  </div>
</template>
