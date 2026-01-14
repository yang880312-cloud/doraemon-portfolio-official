<script setup>
import { computed } from 'vue'

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  }
})

// Logic: 
// Pages are stacked. 
// If index < currentPage, it's flipped to the left (-180deg).
// If index >= currentPage, it's on the right (0deg).
const isFlipped = computed(() => props.index < props.currentPage)
const zIndex = computed(() => {
    // If flipped, higher index should be underneath lower index? No.
    // Standard stack:
    // Page 0 (Cover) - Top
    // Page 1...
    return isFlipped.value ? props.index : 100 - props.index
})
</script>

<template>
  <div 
    class="absolute top-0 right-0 w-1/2 h-full origin-left transition-transform duration-700 ease-in-out preserve-3d cursor-pointer"
    :style="{ 
      transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
      zIndex: zIndex
    }"
  >
    <!-- Front Side -->
    <div class="absolute inset-0 backface-hidden bg-[#fafafa] rounded-r-xl shadow-inner border-l border-gray-200 overflow-hidden text-gray-800 p-8 flex flex-col">
      <slot name="front"></slot>
    </div>

    <!-- Back Side -->
    <div class="absolute inset-0 backface-hidden bg-[#f0f0f0] rounded-l-xl shadow-inner border-r border-gray-200 rotate-y-180 overflow-hidden text-gray-800 p-8 flex flex-col" style="transform: rotateY(180deg);">
      <slot name="back"></slot>
    </div>
  </div>
</template>

<style scoped>
.preserve-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
