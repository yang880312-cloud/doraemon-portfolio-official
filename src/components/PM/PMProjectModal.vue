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
          <div class="relative w-full md:w-1/2 h-1/3 md:h-full bg-[#0f172a] flex flex-col p-6 md:p-10 border-b-4 md:border-b-0 md:border-r-4 border-[#1e3a8a] overflow-hidden group">

             <!-- Background Grid Pattern -->
             <div class="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px]"></div>

             <!-- Main Image Container (Centered, 4:3) -->
             <div class="relative flex-1 flex flex-col justify-center items-center w-full max-w-xl mx-auto">
                 <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#1e3a8a]/50 bg-black group-hover:border-[#fff]/20 transition-colors duration-500">

                     <!-- Prev Button -->
                     <button
                        v-if="hasMultipleImages"
                        @click.stop="prevImage"
                        class="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                     >
                       ←
                     </button>

                     <!-- Image -->
                     <Transition name="fade" mode="out-in">
                        <img
                            :key="currentIndex"
                            :src="currentImage"
                            class="absolute inset-0 w-full h-full object-cover"
                        />
                     </Transition>

                     <!-- Next Button -->
                     <button
                        v-if="hasMultipleImages"
                        @click.stop="nextImage"
                        class="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                     >
                       →
                     </button>
                 </div>

                 <!-- ID Badge (Detached, below image in reference, but overlay is nicer. Let's stick to Overlay per user previous request, OR match the new styled reference which seems to have it integrated?
                      User said: "留存編號...半透明地壓在左上角的圖片上" (Keep numbering... translucent overlay on top left).
                      So I will KEEP IT OVERLAYED as per explicit text instruction, despite visual reference potentially being different.) -->
                 <div class="absolute top-4 left-4 md:top-6 md:left-6 bg-[#1e3a8a] text-white px-3 py-1.5 rounded-lg font-black font-mono shadow-[2px_2px_0px_#ef4444] z-30 pointer-events-none border border-white/20 text-xs md:text-sm tracking-wider">
                    NO. {{ (index + 1).toString().padStart(3, '0') }}
                 </div>
             </div>

             <!-- Thumbnail Strip -->
             <!-- Positioned at bottom center, with darkened backdrop -->
             <div v-if="hasMultipleImages" class="relative z-20 mt-6 flex gap-3 justify-center overflow-x-auto w-full custom-scrollbar shrink-0 pb-2">
               <button
                 v-for="(img, idx) in project.images"
                 :key="idx"
                 @click.stop="currentIndex = idx"
                 class="w-14 h-14 rounded-lg border-2 overflow-hidden transition-all shrink-0 relative hover:scale-110 hover:shadow-lg hover:z-10"
                 :class="currentIndex === idx ? 'border-[#ef4444] scale-110 ring-2 ring-[#ef4444]/30 grayscale-0' : 'border-white/10 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'"
               >
                 <img :src="img" class="w-full h-full object-cover" />
               </button>
             </div>
          </div>

          <!-- RIGHT: Intel Briefing (White Theme) -->
          <div class="w-full md:w-1/2 h-2/3 md:h-full bg-white flex flex-col relative z-20">

            <!-- Header -->
            <div class="px-8 pt-10 pb-6 border-b border-slate-100">
               <div class="flex items-center gap-3 mb-3">
                 <span class="bg-[#fcd34d] text-[#1e3a8a] text-[10px] md:text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border border-yellow-400 shadow-sm">
                   這是一個文件 <!-- Hardcoded for visual match, or use project.category -->
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
                    class="px-3 py-1 bg-slate-50 text-[#1e3a8a] font-bold text-xs rounded border border-slate-200"
                  >
                    {{ tech }}
                  </span>
                </div>
               </div>

               <!-- 4. Impact (Boxed) -->
               <div class="bg-[#f0f9ff] rounded-2xl border border-[#3b82f6]/20 overflow-hidden relative">
                 <div class="absolute top-0 left-0 w-1 h-full bg-[#3b82f6]"></div>
                 <div class="p-6">
                    <h3 class="text-xs font-black text-[#1e3a8a] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span class="text-lg">📊</span> 任務成果
                     </h3>
                     <div class="flex justify-around items-end">
                        <div v-for="(val, key) in project.pm_metrics" :key="key" class="text-center group/metric">
                          <div class="text-xl md:text-3xl font-black text-[#ef4444] font-mono mb-1 group-hover/metric:scale-110 transition-transform">{{ val }}</div>
                          <div class="text-[10px] uppercase font-bold text-[#1e3a8a]/60 tracking-wider">{{ key }}</div>
                        </div>
                     </div>
                 </div>
               </div>

            </div>

             <!-- Footer Button -->
             <div class="p-6 border-t border-slate-100 bg-white">
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
.modal-enter-active,
.modal-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(50px);
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
