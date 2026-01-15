<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['item-click'])

const containerRef = ref(null)
const trackRef = ref(null)
let scrollPos = 0
let autoScrollSpeed = 0.5
let animationFrameId = null

function animate() {
  if (!trackRef.value) return

  // Auto scroll
  scrollPos -= autoScrollSpeed

  // Wrap around logic
  const trackWidth = trackRef.value.scrollWidth / 2 // Assuming duplicated content
  if (scrollPos <= -trackWidth) {
    scrollPos = 0
  }

  gsap.set(trackRef.value, { x: scrollPos })
  animationFrameId = requestAnimationFrame(animate)
}

// Mouse wheel interaction to speed up
function onWheel(e) {
  scrollPos -= e.deltaY * 0.5
}

onMounted(() => {
  // Duplicate items for infinite loop illusion
  animationFrameId = requestAnimationFrame(animate)
  window.addEventListener('wheel', onWheel)
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('wheel', onWheel)
})
</script>

<template>
  <div ref="containerRef" class="w-full h-full flex items-center overflow-hidden cursor-none">
    <!-- Track (Duplated items will be rendered via v-for twice for loop) -->
    <div ref="trackRef" class="flex gap-8 px-8 items-center h-[60vh]">
      <!-- Double the items for seamless loop -->
      <div
        v-for="(item, index) in [...items, ...items, ...items]"
        :key="`${item.id}-${index}`"
        class="relative shrink-0 w-[400px] h-full group perspective-1000"
        @click="emit('item-click', item)"
      >
        <!-- Card -->
        <div
          class="w-full h-full bg-gray-800 rounded-2xl overflow-hidden transform transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-4"
        >
          <img
            :src="item.image"
            loading="lazy"
            class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
          />

          <!-- Overlay Info -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
          >
            <h3
              class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2"
            >
              {{ item.title }}
            </h3>
            <p class="text-gray-300 font-mono text-sm tracking-widest">
              {{ item.category }} // {{ item.mood }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
</style>
