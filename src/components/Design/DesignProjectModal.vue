<script setup>
import { X, ExternalLink } from 'lucide-vue-next'

defineProps({
  isOpen: Boolean,
  project: Object,
  siblings: Array // Added for compatibility with DesignView prop
})

defineEmits(['close', 'switch']) // Added switch emit for compatibility
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/90 backdrop-blur-sm" @click="$emit('close')"></div>

        <!-- Modal Content (Simple V2 Look) -->
        <div class="relative w-full max-w-5xl bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">

            <!-- Image Area -->
            <div class="w-full md:w-2/3 h-64 md:h-auto bg-black relative">
                <img :src="project?.image" class="w-full h-full object-cover" />
                <!-- ID Badge -->
                <div class="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-xs font-mono text-white/60">
                    ID-{{ String(project?.id).padStart(3, '0') }}
                </div>
            </div>

            <!-- Content Area -->
            <div class="w-full md:w-1/3 p-8 flex flex-col overflow-y-auto">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <span class="text-xs text-blue-400 font-mono uppercase tracking-widest">{{ project?.category }}</span>
                        <h2 class="text-3xl font-bold text-white mt-2 mb-2 leading-tight">{{ project?.title }}</h2>
                    </div>
                    <button @click="$emit('close')" class="p-2 bg-white/5 rounded-full hover:bg-white/20 transition-colors">
                        <X class="w-5 h-5 text-white" />
                    </button>
                </div>

                <div class="prose prose-invert prose-sm mb-8">
                    <p class="text-gray-400 leading-relaxed">{{ project?.description }}</p>
                </div>

                <div class="mt-auto pt-6 border-t border-white/10">
                    <div class="grid grid-cols-2 gap-4 text-xs font-mono text-gray-500 mb-6">
                        <div>
                            <span class="block text-gray-700 uppercase mb-1">Client</span>
                            <span class="text-gray-300">{{ project?.client || 'Confidential' }}</span>
                        </div>
                        <div>
                            <span class="block text-gray-700 uppercase mb-1">Year</span>
                            <span class="text-gray-300">{{ project?.year || '2024' }}</span>
                        </div>
                    </div>

                    <a v-if="project?.link" :href="project.link" target="_blank" class="w-full py-3 bg-white text-black font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors rounded">
                        View Live <ExternalLink class="w-4 h-4" />
                    </a>
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
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
