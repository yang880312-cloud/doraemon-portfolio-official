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
        <div class="absolute inset-0 bg-[#0a2463]/90 backdrop-blur-md"></div>

        <!-- Gadget Card Container -->
        <div
          class="relative w-full max-w-5xl h-[90vh] md:h-[80vh] flex flex-col md:flex-row bg-[#ffffff] border-4 border-[#1e3a8a] rounded-[3rem] shadow-[0_20px_50px_rgba(30,58,138,0.5)] overflow-hidden gadget-card"
        >
          <!-- Decorative Hanging Holes (Like a physical tag) -->
          <div class="absolute top-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#0a2463] rounded-full z-50 border-4 border-[#3b82f6]"></div>

          <!-- Close Button -->
          <button
            @click="$emit('close')"
            class="absolute top-6 right-8 z-50 w-12 h-12 flex items-center justify-center bg-[#ef4444] text-white rounded-full font-black text-xl hover:scale-110 transition-transform shadow-md border-4 border-white"
          >
            ✕
          </button>

          <!-- LEFT: Visual Showcase -->
          <div class="relative w-full md:w-5/12 h-1/3 md:h-full bg-[#f0f9ff] flex items-center justify-center p-8 border-b-4 md:border-b-0 md:border-r-4 border-[#1e3a8a] overflow-hidden">
             <!-- Background Pattern -->
             <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#1e3a8a_2px,transparent_2px)] [background-size:20px_20px]"></div>

             <!-- Image Container -->
             <div class="relative w-full h-full flex items-center justify-center p-4">
                 <img
                    :src="currentImage"
                    class="relative z-10 w-auto h-auto max-w-full max-h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />
             </div>

             <!-- ID Badge -->
             <div class="absolute bottom-6 left-6 bg-[#1e3a8a] text-white px-4 py-2 rounded-xl font-black font-mono shadow-[4px_4px_0px_#ef4444]">
               NO. {{ (project.id || 0).toString().padStart(3, '0') }}
             </div>
          </div>

          <!-- RIGHT: Intel Briefing -->
          <div class="w-full md:w-7/12 h-2/3 md:h-full bg-white flex flex-col relative z-20">

            <!-- Header -->
            <div class="p-8 pb-4 border-b-2 border-slate-100 relative z-30">
               <div class="flex items-center gap-3 mb-2 relative">
                 <span class="bg-[#fcd34d] text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border-2 border-black/10">
                   {{ project.category }}
                 </span>
               </div>
               <h2 class="text-4xl md:text-5xl font-black text-[#1e3a8a] tracking-tighter leading-tight relative z-10">
                 {{ project.title }}
                 <span class="text-[#ef4444] text-xl align-top">★</span>
               </h2>
               <p class="text-lg text-slate-500 font-medium mt-2">{{ project.description }}</p>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

              <!-- 1. The Glitch (Problem) -->
              <div class="relative pl-6 border-l-4 border-[#ef4444]">
                <h3 class="text-sm font-black text-[#ef4444] uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span class="text-xl">⚡</span> The Glitch (Problem)
                </h3>
                <p class="text-slate-700 leading-relaxed font-medium">
                  {{ project.details?.problem || "System data unavailable." }}
                </p>
              </div>

              <!-- 2. The Gadget (Solution) -->
              <div class="relative pl-6 border-l-4 border-[#3b82f6]">
                <h3 class="text-sm font-black text-[#3b82f6] uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span class="text-xl">💡</span> The Gadget (Solution)
                </h3>
                <p class="text-slate-700 leading-relaxed font-medium">
                   {{ project.details?.solution || "Solution data unavailable." }}
                </p>
              </div>

               <!-- 3. Tech Stack -->
               <div>
                  <h3 class="text-sm font-black text-[#1e3a8a] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span class="text-xl">🛠️</span> Core Mechanics
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tech in (project.details?.tech || project.tags)"
                    :key="tech"
                    class="px-3 py-1 bg-slate-100 text-[#1e3a8a] font-bold text-sm rounded-lg border border-slate-200"
                  >
                    {{ tech }}
                  </span>
                </div>
               </div>

               <!-- 4. Impact -->
               <div class="bg-[#f0f9ff] p-6 rounded-2xl border-2 border-[#1e3a8a]/20">
                 <h3 class="text-sm font-black text-[#1e3a8a] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span class="text-xl">📊</span> Mission Results
                 </h3>
                 <div class="grid grid-cols-3 gap-4">
                    <div v-for="(val, key) in project.pm_metrics" :key="key" class="text-center">
                      <div class="text-2xl font-black text-[#ef4444] font-mono">{{ val }}</div>
                      <div class="text-[10px] uppercase font-bold text-[#1e3a8a]/60">{{ key }}</div>
                    </div>
                 </div>
                 <p class="mt-4 text-sm text-[#1e3a8a] italic border-t border-[#1e3a8a]/10 pt-4">
                   "{{ project.details?.impact || 'Impact data confidential.' }}"
                 </p>
               </div>

            </div>

             <!-- Footer Button -->
             <div class="p-6 border-t border-slate-100 bg-white">
                <a :href="project.link || '#'" target="_blank" class="block w-full text-center bg-[#1e3a8a] text-white font-black py-4 rounded-xl text-lg hover:bg-[#172554] hover:-translate-y-1 transition-all shadow-[0_8px_0px_#0a2463] active:translate-y-0 active:shadow-none">
                  ACCESS PROJECT REPO >>
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
