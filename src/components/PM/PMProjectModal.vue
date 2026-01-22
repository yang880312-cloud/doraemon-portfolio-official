<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  project: Object,
  index: Number,
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

function nextImage() {
  if (!hasMultipleImages.value) return
  currentIndex.value = (currentIndex.value + 1) % props.project.images.length
}

function prevImage() {
  if (!hasMultipleImages.value) return
  currentIndex.value = (currentIndex.value - 1 + props.project.images.length) % props.project.images.length
}

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
        <div class="absolute inset-0 bg-[#0a2463]/90 backdrop-blur-md"></div>

        <!-- Main Card Container (Significantly Widened for Landscape) -->
        <div
          class="relative w-full max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[1400px] h-[90vh] md:h-[80vh] flex flex-col md:flex-row bg-white border-4 border-[#1e3a8a] rounded-[2.5rem] shadow-[0_20px_60px_rgba(15,23,42,0.6)] overflow-hidden gadget-card transition-all duration-300"
        >

          <!-- Close Button -->
          <button
            @click="$emit('close')"
            class="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center bg-[#ef4444] text-white rounded-full font-black hover:scale-110 transition-transform shadow-md border-2 border-white"
          >
            ✕
          </button>

          <!-- LEFT: Visual Showcase (Dark Theme, Full Bleed Image) -->
          <div class="relative w-full md:w-[55%] lg:w-[60%] h-1/3 md:h-full bg-black flex flex-col items-center justify-center p-0 overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-[#1e3a8a] group relative">

             <!-- Navigation Arrows (Subtle, appear on hover) -->
             <button
                v-if="hasMultipleImages"
                @click.stop="prevImage"
                class="absolute left-0 top-0 bottom-0 z-20 w-16 flex items-center justify-center bg-gradient-to-r from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white"
             >
                <span class="text-4xl font-light transform -translate-x-2 group-hover:translate-x-0 transition-transform">‹</span>
             </button>

             <button
                v-if="hasMultipleImages"
                @click.stop="nextImage"
                class="absolute right-0 top-0 bottom-0 z-20 w-16 flex items-center justify-center bg-gradient-to-l from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white"
             >
                <span class="text-4xl font-light transform translate-x-2 group-hover:translate-x-0 transition-transform">›</span>
             </button>

             <!-- Main Image (Pure Full Bleed) -->
             <div class="relative w-full h-full z-10">
                <Transition name="fade" mode="out-in">
                    <img
                        :key="currentIndex"
                        :src="currentImage"
                        class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt="Project Visual"
                    />
                </Transition>
             </div>
          </div>

          <!-- RIGHT: Intel Briefing -->
          <div class="w-full md:w-[45%] lg:w-[40%] h-2/3 md:h-full bg-[#F8FAFC] flex flex-col relative z-20">

            <!-- Header -->
            <div class="px-8 pt-10 pb-6 border-b border-slate-200">
               <div class="flex items-center gap-4 mb-3">
                 <!-- Number Badge (Moved to Left) -->
                 <div class="font-black font-mono text-slate-400 text-xs tracking-widest border border-slate-200 px-2 py-1 rounded bg-white">
                    NO. {{ (index + 1).toString().padStart(3, '0') }}
                 </div>
                 <div class="flex items-center gap-3">
                    <span class="bg-[#fcd34d] text-[#1e3a8a] text-[10px] md:text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border border-yellow-400 shadow-sm">
                        {{ project.category || "PROJECT" }}
                    </span>
                 </div>
               </div>
               <h2 class="text-3xl md:text-4xl xl:text-5xl font-black text-[#1e3a8a] tracking-tight leading-none mb-2">
                 {{ project.title }}
                 <span class="text-[#ef4444] text-xl align-top">★</span>
               </h2>
               <p class="text-sm md:text-base text-slate-500 font-medium leading-normal max-w-md">
                 {{ project.description }}
               </p>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar">

              <!-- 1. The Glitch (Problem) -->
              <div class="flex gap-4">
                <div class="w-1 bg-[#ef4444] rounded-full shrink-0 h-auto"></div>
                <div>
                   <h3 class="text-xs font-black text-[#ef4444] uppercase tracking-widest mb-1 flex items-center gap-2">
                    <span class="text-lg leading-none">⚡</span> 故障 (問題)
                  </h3>
                  <p class="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
                    {{ project.details?.problem || "System data unavailable." }}
                  </p>
                </div>
              </div>

              <!-- 2. The Gadget (Solution) -->
              <div class="flex gap-4">
                <div class="w-1 bg-[#3b82f6] rounded-full shrink-0 h-auto"></div>
                <div>
                  <h3 class="text-xs font-black text-[#3b82f6] uppercase tracking-widest mb-1 flex items-center gap-2">
                    <span class="text-lg leading-none">💡</span> 小工具 (解決方案)
                  </h3>
                  <p class="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
                     {{ project.details?.solution || "Solution data unavailable." }}
                  </p>
                </div>
              </div>

               <!-- 3. Tech Stack -->
               <div class="pl-5">
                  <h3 class="text-xs font-black text-[#64748b] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span class="text-lg">🛠️</span> 核心機制
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tech in (project.details?.tech || project.tags)"
                    :key="tech"
                    class="px-3 py-1 bg-white text-[#1e3a8a] font-bold text-xs rounded border border-slate-200 shadow-sm"
                  >
                    {{ tech }}
                  </span>
                </div>
               </div>

               <!-- 4. Impact (Boxed & Larger Metrics) -->
               <div class="bg-[#eff6ff] rounded-xl border-l-4 border-[#3b82f6] overflow-hidden relative shadow-sm p-6">
                  <h3 class="text-xs font-black text-[#1e3a8a] uppercase tracking-widest mb-6 flex items-center gap-2">
                    <!-- Icon -->
                    <div class="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 rounded-md shadow-sm">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    </div>
                    任務成果
                 </h3>
                 <div class="flex flex-wrap justify-between items-start gap-y-6">
                    <div v-for="(val, key) in project.pm_metrics" :key="key" class="text-center group/metric flex-1 min-w-[100px]">

                      <!-- Value Parsing Logic (Inline for simplicity) -->
                      <div class="flex items-baseline justify-center gap-1 mb-1">
                        <!-- Big Number -->
                        <span class="text-3xl md:text-5xl font-black text-[#ef4444] font-mono tracking-tighter drop-shadow-sm">
                           {{ typeof val === 'string' ? val.match(/^([-+0-9.%]+)/)?.[0] || val : val }}
                        </span>
                        <!-- Small Unit -->
                         <span class="text-base md:text-xl font-bold text-[#ef4444] font-mono opacity-80">
                            {{ typeof val === 'string' ? val.replace(/^([-+0-9.%]+)/, '').trim() : '' }}
                         </span>
                      </div>

                      <!-- Label -->
                      <div class="text-[10px] md:text-xs font-bold text-[#64748b] tracking-[0.2em] uppercase">{{ key }}</div>
                    </div>
                 </div>
               </div>

            </div>

             <!-- Footer Button -->
             <div class="p-6 border-t border-slate-200 bg-[#F8FAFC]">
                <a :href="project.link || '#'" target="_blank" class="block w-full text-center bg-[#1e3a8a] text-white font-black py-4 rounded-xl text-lg tracking-wide hover:bg-[#172554] hover:shadow-lg hover:-translate-y-1 transition-all shadow-[0_4px_0px_#0a2463] active:translate-y-0 active:shadow-none bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:0_0,0_0] hover:bg-[position:100%_100%,0_0]">
                  訪問專案倉庫 >>
                </a>
             </div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal Entry Animation */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); /* Ease-out quart for premium feel */
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px); /* Subtle zoom-in instead of drastic move */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.gadget-card {
  perspective: 1000px;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
