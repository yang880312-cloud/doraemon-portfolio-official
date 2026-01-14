<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  totalPages: {
    type: Number,
    required: true
  }
})

const currentPage = ref(0) // 0 = closed cover, 1 = first spread, etc.

const isFirstPage = computed(() => currentPage.value === 0)
const isLastPage = computed(() => currentPage.value >= props.totalPages)

function nextPage() {
  if (!isLastPage.value) currentPage.value++
}

function prevPage() {
  if (!isFirstPage.value) currentPage.value--
}
</script>

<template>
  <div class="relative w-full h-full flex items-center justify-center perspective-2000">
    <div class="relative w-[800px] h-[500px] preserve-3d transition-transform duration-1000" :style="{ transform: currentPage > 0 ? 'translateX(50%)' : 'translateX(0)' }">
      <!-- Book Spine/Backing -->
      <div class="absolute inset-0 bg-[#1a1a1a] rounded-r-xl shadow-2xl translate-z-[-2px]"></div>

      <slot :current-page="currentPage" :next="nextPage" :prev="prevPage"></slot>

    </div>
    
    <!-- Navigation hints -->
    <div class="absolute bottom-10 flex gap-4 text-white/50 text-sm font-mono tracking-widest">
      <button @click="prevPage" :disabled="isFirstPage" class="hover:text-white disabled:opacity-20">&lt; PREV</button>
      <span>PAGE {{ currentPage }}</span>
      <button @click="nextPage" :disabled="isLastPage" class="hover:text-white disabled:opacity-20">NEXT &gt;</button>
    </div>
  </div>
</template>

<style scoped>
.perspective-2000 {
  perspective: 2000px;
}
.preserve-3d {
  transform-style: preserve-3d;
}
</style>
