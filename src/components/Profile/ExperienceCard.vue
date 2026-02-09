<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

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

onMounted(() => {
    // Entrance Animation handled by parent?
    // Or self-contained. Let's make it self-contained for simplicity if possible,
    // but ScrollTrigger works best when created in batch or context.
    // However, basic fade-in can be here.

    // We will leave the heavy GSAP logic to the parent (ProfileTimeMachine)
    // to coordinate the "Active State" linkage.
})
</script>

<template>
  <div ref="cardRef"
       class="experience-card group relative p-6 md:p-8 rounded-2xl border border-[rgba(66,184,131,0.2)] bg-black/20 backdrop-blur-[12px] hover:border-[#42b883] hover:shadow-[0_0_30px_rgba(66,184,131,0.15)] transition-all duration-500 mb-12">

    <!-- Time Track Connector (Visual) -->
    <div class="absolute -left-4 top-10 w-4 h-[1px] bg-[#42b883]/30 hidden md:block"></div>
    <div class="absolute -left-[19px] top-9 w-2 h-2 rounded-full bg-[#42b883] shadow-[0_0_10px_#42b883] hidden md:block group-hover:scale-150 transition-transform duration-300"></div>

    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
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
      <div class="mt-4 md:mt-0 opacity-50 group-hover:opacity-100 transition-opacity">
          <img v-if="experience.image" :src="experience.image" class="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
      </div>
    </div>

    <!-- Description -->
    <div class="text-gray-300 leading-relaxed mb-6 font-light">
      {{ experience.description }}
    </div>

    <!-- Bullets -->
    <ul class="space-y-2 mb-6" v-if="experience.bullets">
        <li v-for="(bullet, i) in experience.bullets" :key="i" class="flex items-start gap-3 text-sm text-gray-400">
            <span class="text-[#42b883] mt-1">▹</span>
            <span>{{ bullet }}</span>
        </li>
    </ul>

    <!-- Tech Stack -->
    <div class="flex flex-wrap gap-2 pt-4 border-t border-white/5">
      <span v-for="tech in experience.techStack" :key="tech"
            class="text-xs font-mono px-3 py-1 rounded bg-[#42b883]/5 text-[#42b883] border border-[#42b883]/20 hover:bg-[#42b883]/20 transition-colors cursor-default">
        {{ tech }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.experience-card {
    /* Optional: glass reflection line */
    overflow: hidden;
}
</style>
