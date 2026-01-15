<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  project: Object,
})

const emit = defineEmits(['close'])

const currentIndex = ref(0)
const hasMultipleImages = computed(() => props.project?.images && props.project.images.length > 1)
const currentImage = computed(() => {
  if (hasMultipleImages.value) {
    return props.project.images[currentIndex.value]
  }
  return props.project?.image
})

// Prevent scrolling when modal is open
onMounted(() => {
  if (props.isOpen) document.body.style.overflow = 'hidden'
})
onUnmounted(() => (document.body.style.overflow = ''))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
        @click.self="$emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>

        <!-- Tech Dossier Container -->
        <div
          class="relative w-full max-w-6xl h-[85vh] flex flex-col md:flex-row bg-[#050505] border border-cyan-900/50 shadow-[0_0_50px_rgba(8,145,178,0.1)] overflow-hidden dossier-frame"
        >
          <!-- Decorative Tech Borders -->
          <div
            class="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyan-500/50 pointer-events-none"
          ></div>
          <div
            class="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-cyan-500/50 pointer-events-none"
          ></div>
          <div class="absolute top-0 right-0 w-4 h-4 bg-cyan-500/20 pointer-events-none"></div>
          <div class="absolute bottom-0 left-0 w-4 h-4 bg-cyan-500/20 pointer-events-none"></div>

          <!-- Close Button -->
          <button
            @click="$emit('close')"
            class="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center border border-cyan-500/30 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all font-mono"
          >
            ✕
          </button>

          <!-- LEFT: Data/Image Hybrid -->
          <div class="relative w-full md:w-2/3 h-1/2 md:h-full bg-gray-900 overflow-hidden group">
            <!-- Image Slider -->
            <div class="w-full h-full relative bg-black flex items-center justify-center">
              <img
                :src="currentImage"
                class="w-full h-full object-contain md:object-cover transition-opacity duration-700 mx-auto"
              />

              <!-- Navigation (Only if multiple images) -->
              <div v-if="hasMultipleImages" class="absolute bottom-4 right-4 flex gap-2 z-20">
                <button
                  v-for="(img, idx) in project.images"
                  :key="idx"
                  @click.stop="currentIndex = idx"
                  class="w-8 h-8 flex items-center justify-center text-[10px] font-mono border transition-all"
                  :class="
                    currentIndex === idx
                      ? 'bg-cyan-500 text-black border-cyan-500 font-bold'
                      : 'bg-black/50 text-cyan-500 border-cyan-900 hover:bg-cyan-900/50'
                  "
                >
                  {{ (idx + 1).toString().padStart(2, '0') }}
                </button>
              </div>
            </div>

            <!-- Grid Overlay -->
            <div
              class="absolute inset-0 bg-[url('https://patterns.ibthemespro.com/res/lines.png')] opacity-10 pointer-events-none"
            ></div>

            <!-- Floating Data Points -->
            <div
              class="absolute bottom-8 left-8 font-mono text-xs text-cyan-400 bg-black/80 px-4 py-2 border-l-4 border-cyan-500 backdrop-blur z-10"
            >
              <div>IMG_SOURCE: {{ project?.id || '001' }}</div>
              <div>RES: HIGH_FIDELITY</div>
              <div v-if="hasMultipleImages" class="text-[9px] text-gray-500 mt-1">
                FIG {{ currentIndex + 1 }} / {{ project.images.length }}
              </div>
            </div>
          </div>

          <!-- RIGHT: Information Terminal -->
          <div
            class="w-full md:w-1/3 h-1/2 md:h-full bg-[#0a0a0c] flex flex-col border-l border-cyan-900/30 relative"
          >
            <!-- Scan Line -->
            <div
              class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"
            ></div>

            <div class="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <div class="mb-8">
                <div class="text-[10px] text-cyan-600 font-mono tracking-[0.2em] mb-2">
                  // CLASSIFIED FILE
                </div>
                <h2 class="text-4xl font-bold text-white mb-2 uppercase tracking-tight">
                  {{ project?.title }}
                </h2>
                <div
                  class="inline-block px-2 py-1 bg-cyan-900/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono"
                >
                  TYPE: {{ project?.category || 'LOGIC_MODULE' }}
                </div>
              </div>

              <div class="space-y-6">
                <div class="p-4 bg-cyan-900/5 border border-cyan-500/10 relative">
                  <!-- Corner accents -->
                  <div
                    class="absolute top-0 left-0 w-2 h-2 border-l border-t border-cyan-500/50"
                  ></div>
                  <div
                    class="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-cyan-500/50"
                  ></div>

                  <h4 class="text-xs font-mono text-gray-500 mb-2">[ BRIEFIING ]</h4>
                  <p class="text-gray-300 text-sm leading-relaxed font-light">
                    {{
                      project?.description ||
                      'System data not available. Please contact administrator.'
                    }}
                  </p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div
                    class="bg-black border border-gray-800 p-3 flex flex-col items-center justify-center"
                  >
                    <span class="text-2xl font-mono text-cyan-400">{{
                      project?.metricK || 'N/A'
                    }}</span>
                    <span class="text-[10px] text-gray-600 uppercase tracking-widest mt-1"
                      >Efficiency</span
                    >
                  </div>
                  <div
                    class="bg-black border border-gray-800 p-3 flex flex-col items-center justify-center"
                  >
                    <span class="text-2xl font-mono text-white">ACTIVE</span>
                    <span class="text-[10px] text-gray-600 uppercase tracking-widest mt-1"
                      >Status</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Action -->
            <div class="p-8 border-t border-cyan-900/30">
              <button
                class="w-full group relative px-6 py-3 bg-transparent overflow-hidden text-cyan-400 font-mono text-sm border border-cyan-500/50 hover:border-cyan-400 transition-all"
              >
                <span
                  class="absolute w-full h-full bg-cyan-500/10 left-0 top-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"
                ></span>
                <span class="relative flex items-center justify-center gap-2">
                  <span>INITIATE_PROTOCOL</span>
                  <span>>></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
  transition-delay: 0.1s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.dossier-frame {
  box-shadow: 0 0 100px rgba(0, 0, 0, 0.8);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #050505;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #0e7490;
}

/* Tech Reveal Animation */
.modal-enter-active .dossier-frame {
  animation: tech-reveal 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

@keyframes tech-reveal {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
    clip-path: inset(50% 0 50% 0);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    clip-path: inset(0 0 0 0);
  }
}
</style>
