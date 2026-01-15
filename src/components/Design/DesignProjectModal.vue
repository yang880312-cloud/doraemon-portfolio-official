<script setup>
import { ref, computed, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  project: Object,
  siblings: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'switch'])

const currentIndex = ref(0)

// Reset index when project changes
watch(
  () => props.project,
  () => {
    currentIndex.value = 0
  },
)

const images = computed(() => {
  if (props.project?.images && props.project.images.length > 0) {
    return props.project.images
  }
  return props.project?.image ? [props.project.image] : []
})

const currentImage = computed(() => {
  return images.value[currentIndex.value]
})

function next() {
  if (currentIndex.value < images.value.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = images.value.length - 1
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex flex-col justify-center items-center"
        @click.self="$emit('close')"
      >
        <!-- Large Backdrop Image (Blurred) -->
        <div
          class="absolute inset-0 opacity-30 select-none pointer-events-none transition-opacity duration-700"
        >
          <img :src="currentImage" class="w-full h-full object-cover blur-3xl" />
        </div>

        <!-- Main Content (Maximized) -->
        <!-- Main Content (Maximized + Styled + Transparent + Lifted) -->
        <div
          class="relative z-10 w-[95vw] h-[80vh] mb-40 flex flex-col md:flex-row gap-12 p-8 md:p-12 bg-black/70 backdrop-blur-2xl rounded-3xl border border-white/[0.05] shadow-2xl overflow-hidden"
        >
          <!-- Close -->
          <button
            @click="$emit('close')"
            class="absolute top-6 right-6 z-50 p-2 rounded-full border border-white/10 text-white/50 hover:bg-white hover:text-black transition-all"
          >
            <X class="w-6 h-6" />
          </button>

          <!-- Image Stage (16:9 Aspect Ratio) -->
          <div class="flex-1 flex items-center justify-center p-4">
            <div
              class="relative w-full aspect-video bg-black/50 rounded-lg border border-white/5 group overflow-hidden shadow-xl"
            >
              <transition name="slide-fade" mode="out-in">
                <img :key="currentIndex" :src="currentImage" class="w-full h-full object-cover" />
              </transition>

              <!-- Nav Buttons -->
              <div
                v-if="images.length > 1"
                class="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <button
                  @click.stop="prev"
                  class="w-12 h-12 rounded-full bg-black/50 hover:bg-white/20 text-white backdrop-blur flex items-center justify-center text-2xl"
                >
                  ‹
                </button>
                <button
                  @click.stop="next"
                  class="w-12 h-12 rounded-full bg-black/50 hover:bg-white/20 text-white backdrop-blur flex items-center justify-center text-2xl"
                >
                  ›
                </button>
              </div>

              <!-- Pagination -->
              <div
                v-if="images.length > 1"
                class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
              >
                <span
                  v-for="(img, idx) in images"
                  :key="idx"
                  class="w-2 h-2 rounded-full transition-all"
                  :class="idx === currentIndex ? 'bg-white w-4' : 'bg-white/30'"
                ></span>
              </div>
            </div>
          </div>

          <!-- Text Content -->
          <div
            class="w-full md:w-[450px] flex flex-col justify-center text-white shrink-0 py-8 overflow-y-auto no-scrollbar"
          >
            <div class="mb-10">
              <h2
                class="text-5xl md:text-6xl font-black mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-500 break-words"
              >
                {{ project?.title }}
              </h2>
              <p class="font-mono text-sm opacity-50 tracking-[0.2em] uppercase">
                {{ project?.category }}
              </p>
            </div>

            <p
              class="text-xl opacity-80 leading-relaxed font-light mb-12 font-sans border-l-2 border-white/20 pl-6"
            >
              {{
                project?.description ||
                'Immersive visual experience. Pure aesthetic exploration designed to challenge perception and form.'
              }}
            </p>

            <div class="grid grid-cols-2 gap-8 text-sm font-mono opacity-60">
              <div>
                <div class="uppercase tracking-wider mb-2 text-[10px] text-purple-400">Year</div>
                <div>2026</div>
              </div>
              <div>
                <div class="uppercase tracking-wider mb-2 text-[10px] text-purple-400">
                  Services
                </div>
                <div>Art Direction</div>
              </div>
              <div>
                <div class="uppercase tracking-wider mb-2 text-[10px] text-purple-400">
                  Resolution
                </div>
                <div>4K / 16:9</div>
              </div>
            </div>
          </div>
        </div>

        <!-- NEW: Bottom Navigation Strip (Visible Trigger) -->
        <div
          class="fixed bottom-0 left-0 w-full h-40 z-[300] flex items-end justify-center group/nav pointer-events-none"
        >
          <!-- The actual interactive bar (pointers-events-auto) -->
          <!-- translate-y-[30%] means 70% visible initially. -->
          <div
            class="pointer-events-auto w-full h-32 bg-gradient-to-t from-black via-black/90 to-transparent flex items-end justify-center pb-8 translate-y-[30%] hover:translate-y-0 transition-transform duration-300 border-t border-white/10 opacity-60 hover:opacity-100"
          >
            <div class="flex gap-4 overflow-x-auto pb-2 no-scrollbar max-w-[90vw]">
              <div
                v-for="p in siblings"
                :key="p.id"
                @click="$emit('switch', p)"
                class="relative w-32 aspect-video bg-gray-900 rounded border border-gray-700 cursor-pointer overflow-hidden opacity-50 hover:opacity-100 hover:scale-110 hover:border-purple-400 transition-all"
                :class="project?.id === p.id ? '!opacity-100 ring-2 ring-purple-500' : ''"
              >
                <img :src="p.image" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- Hover Hint - Visual Cue -->
            <div
              class="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 group-hover/nav:opacity-0 transition-opacity"
            >
              <div class="w-12 h-1 rounded-full bg-white/30"></div>
              <span class="text-[10px] text-white/30 tracking-widest uppercase"
                >Other Projects</span
              >
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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

/* Slide Fade for Images */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: scale(1.1);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Force Hide Scrollbar */
.no-scrollbar::-webkit-scrollbar {
  display: none !important;
}
.no-scrollbar {
  -ms-overflow-style: none !important;
  scrollbar-width: none !important;
}
</style>
