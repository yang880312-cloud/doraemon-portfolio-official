<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  experience: {
    type: Object,
    required: true
  },
  index: {
      type: Number,
      default: 0
  }
})

const cardRef = ref(null)

// --- 3D Tilt Logic ---
const cardStyle = ref({
    transform: 'perspective(1000px) rotateX(0) rotateY(0)',
})
const sheenStyle = ref({
    opacity: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(66, 184, 131, 0.4), transparent 60%)'
})

function handleMouseMove(e) {
    if (!cardRef.value) return
    const rect = cardRef.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate rotation (Max 10 degrees)
    // RotateX is based on Y-axis movement (up/down)
    // RotateY is based on X-axis movement (left/right)
    const rotateX = ((y - centerY) / centerY) * -5
    const rotateY = ((x - centerX) / centerX) * 5

    cardStyle.value = {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: 'transform 0.1s ease-out' // Fast reaction
    }

    // Sheen follows mouse
    sheenStyle.value = {
        opacity: 0.6,
        background: `radial-gradient(circle at ${x}px ${y}px, rgba(66, 184, 131, 0.15), transparent 40%)`,
        transition: 'opacity 0.2s'
    }
}

function handleMouseLeave() {
    cardStyle.value = {
        transform: 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
        transition: 'transform 0.5s ease-out' // Smooth return
    }
    sheenStyle.value = {
        opacity: 0,
        background: sheenStyle.value.background,
        transition: 'opacity 0.5s'
    }
}
</script>

<template>
  <!-- Wrapper for perspective (if needed, but applied inline also works) -->
  <div class="experience-card-wrapper h-full perspective-container" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
      <div ref="cardRef"
           :style="cardStyle"
           class="experience-card group relative p-6 md:p-8 rounded-2xl border border-[rgba(66,184,131,0.2)] bg-black/40 backdrop-blur-[12px] hover:border-[#42b883] hover:shadow-[0_0_30px_rgba(66,184,131,0.15)] transition-colors duration-300 md:mb-12 cursor-default transform-gpu">

        <!-- Interactive Sheen Overlay -->
        <div class="absolute inset-0 z-0 pointer-events-none rounded-2xl transition-opacity duration-300" :style="sheenStyle"></div>

        <!-- Time Track Connector (Visual) -->
        <div class="absolute -left-4 top-10 w-4 h-[1px] bg-[#42b883]/30 hidden md:block"></div>
        <div class="absolute -left-[19px] top-9 w-2 h-2 rounded-full bg-[#42b883] shadow-[0_0_10px_#42b883] hidden md:block group-hover:scale-150 transition-transform duration-300"></div>

        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">
          <div>
            <h3 class="text-2xl font-bold text-white group-hover:text-[#42b883] transition-colors duration-300">
              {{ experience.role }}
            </h3>
            <div class="text-lg text-[#42b883]/80 font-mono mt-1 flex items-center gap-2">
                <span>@{{ experience.company }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full border border-[#42b883]/30 text-[#42b883]/60" v-if="experience.period">{{ experience.period }}</span>
            </div>
          </div>
          <!-- Logo or Icon Placeholder -->
          <div class="mt-4 md:mt-0 opacity-50 group-hover:opacity-100 transition-opacity translate-z-10 group-hover:translate-z-20">
              <img v-if="experience.image" :src="experience.image" class="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          </div>
        </div>

        <!-- Description -->
        <div class="text-gray-300 leading-relaxed mb-6 font-light relative z-10">
          {{ experience.description }}
        </div>

        <!-- Bullets -->
        <ul class="space-y-2 mb-6 relative z-10" v-if="experience.bullets">
            <li v-for="(bullet, i) in experience.bullets" :key="i" class="flex items-start gap-3 text-sm text-gray-400">
                <span class="text-[#42b883] mt-1">▹</span>
                <span>{{ bullet }}</span>
            </li>
        </ul>

        <!-- Tech Stack -->
        <div class="flex flex-wrap gap-2 pt-4 border-t border-white/5 relative z-10">
          <span v-for="tech in experience.techStack" :key="tech"
                class="text-xs font-mono px-3 py-1 rounded bg-[#42b883]/5 text-[#42b883] border border-[#42b883]/20 hover:bg-[#42b883]/20 transition-colors cursor-default hover:text-white">
            {{ tech }}
          </span>
        </div>
      </div>
  </div>
</template>

<style scoped>
.perspective-container {
    perspective: 1000px;
}
.experience-card {
    will-change: transform;
}
</style>
