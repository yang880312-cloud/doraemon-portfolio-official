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

        <!-- Main Card Container -->
        <div
          class="relative w-full max-w-6xl h-[90vh] md:h-[80vh] flex flex-col md:flex-row bg-white border-4 border-[#1e3a8a] rounded-[2.5rem] shadow-[0_20px_60px_rgba(15,23,42,0.6)] overflow-hidden gadget-card"
        >

          <!-- Close Button -->
          <button
            @click="$emit('close')"
            class="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center bg-[#ef4444] text-white rounded-full font-black hover:scale-110 transition-transform shadow-md border-2 border-white"
          >
            ✕
          </button>

          <!-- LEFT: Visual Showcase (Dark Theme) -->
          <div class="relative w-full md:w-1/2 h-1/3 md:h-[600px] lg:h-full bg-[#0b1121] flex flex-col items-center justify-center p-0 overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-[#1e3a8a] group relative">

             <!-- Background Elements -->
             <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.2)_0%,rgba(15,23,42,1)_100%)]"></div>
             <div class="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px]"></div>

             <!-- Main Image Container (Full Width/Height) -->
             <div class="relative w-full h-full z-10 group/image">

                <!-- Number Badge (Floating Top-Left) -->
                <div class="absolute top-6 left-6 z-30 px-4 py-1.5 bg-[#172554]/80 border border-[#3b82f6]/30 text-[#3b82f6] text-xs font-black tracking-widest rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] backdrop-blur-md uppercase flex items-center gap-2">
                   <div class="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse"></div>
                   NO. {{ (index + 1).toString().padStart(3, '0') }}
                </div>

                <!-- Nav Buttons -->
                <button
                    v-if="hasMultipleImages"
                    @click.stop="prevImage"
                    class="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full backdrop-blur-md border border-white/10 hover:bg-[#3b82f6] hover:border-[#3b82f6] transition-all opacity-0 group-hover/image:opacity-100 -translate-x-4 group-hover/image:translate-x-0"
                >
                   ←
                </button>

                 <button
                    v-if="hasMultipleImages"
                    @click.stop="nextImage"
                    class="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full backdrop-blur-md border border-white/10 hover:bg-[#3b82f6] hover:border-[#3b82f6] transition-all opacity-0 group-hover/image:opacity-100 translate-x-4 group-hover/image:translate-x-0"
                 >
                   →
                 </button>

                 <!-- Image Frame (Full Bleed with minor margin) -->
                 <div class="w-full h-full p-4 md:p-6">
                    <div class="w-full h-full rounded-2xl overflow-hidden border-2 border-[#1e3a8a]/50 shadow-[0_0_40px_rgba(30,58,138,0.4)] relative bg-[#0f172a]">
                        <Transition name="fade" mode="out-in">
                            <img
                                :key="currentIndex"
                                :src="currentImage"
                                class="absolute inset-0 w-full h-full object-cover"
                            />
                        </Transition>
                        <!-- Glass Reflection Overlay -->
                        <div class="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                    </div>
                 </div>
             </div>

             <!-- Thumbnail Strip (Floating Bottom Overlay) -->
             <div v-if="hasMultipleImages" class="absolute bottom-6 md:bottom-8 z-20 flex gap-2 justify-center w-full max-w-md px-4 pointer-events-none">
               <div class="flex gap-2 p-2 bg-black/30 backdrop-blur-md rounded-2xl pointer-events-auto border border-white/10">
                   <button
                     v-for="(img, idx) in project.images"
                     :key="idx"
                     @click.stop="currentIndex = idx"
                     class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border overflow-hidden transition-all shrink-0 hover:scale-110 relative"
                     :class="currentIndex === idx ? 'border-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.5)] opacity-100 scale-110' : 'border-white/10 opacity-50 hover:opacity-100 grayscale hover:grayscale-0'"
                   >
                     <img :src="img" class="w-full h-full object-cover" />
                   </button>
               </div>
             </div>
          </div>

          <!-- RIGHT: Intel Briefing (White Theme -> Soft Slate Theme) -->
          <div class="w-full md:w-1/2 h-2/3 md:h-full bg-[#F8FAFC] flex flex-col relative z-20">

            <!-- Header -->
            <div class="px-8 pt-10 pb-6 border-b border-slate-200">
               <div class="flex items-center gap-3 mb-3">
                 <span class="bg-[#fcd34d] text-[#1e3a8a] text-[10px] md:text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border border-yellow-400 shadow-sm">
                   {{ project.category || "PROJECT" }}
                 </span>
               </div>
               <h2 class="text-3xl md:text-5xl font-black text-[#1e3a8a] tracking-tight leading-none mb-2">
                 {{ project.title }}
                 <span class="text-[#ef4444] text-2xl align-top">★</span>
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
