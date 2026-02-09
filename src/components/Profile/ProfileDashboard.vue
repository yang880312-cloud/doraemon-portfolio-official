<script setup>
import { computed, ref, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  experience: {
    type: Object,
    default: null
  }
})

// --- Growth Metric Animation ---
const processedGrowth = ref(0)
const growthLabel = ref('Efficiency')

watch(() => props.experience, (newExp) => {
  if (newExp && newExp.growth) {
    // Animate numbers
    gsap.to(processedGrowth, {
      value: newExp.growth.value,
      duration: 1.5,
      ease: 'power2.out',
      roundProps: 'value'
    })
    growthLabel.value = newExp.growth.label
  } else {
     gsap.to(processedGrowth, { value: 0, duration: 0.5 })
     growthLabel.value = 'Standby'
  }
}, { immediate: true })

// --- Radar Chart Logic (Computed Points for SVG) ---
const radarPoints = computed(() => {
  if (!props.experience || !props.experience.radar) return ''

  const metrics = props.experience.radar
  const total = metrics.length
  const radius = 100
  const center = 110 // Center of SVG (110x110 to give padding)

  return metrics.map((m, i) => {
    const angle = (Math.PI * 2 * i) / total - Math.PI / 2 // Start from top
    const value = (m.value / 100) * radius
    const x = center + Math.cos(angle) * value
    const y = center + Math.sin(angle) * value
    return `${x},${y}`
  }).join(' ')
})

const radarLabels = computed(() => {
    if (!props.experience || !props.experience.radar) return []
     const total = props.experience.radar.length
    const radius = 125 // Label radius slightly outside
     const center = 110

    return props.experience.radar.map((m, i) => {
        const angle = (Math.PI * 2 * i) / total - Math.PI / 2
        const x = center + Math.cos(angle) * radius
        const y = center + Math.sin(angle) * radius
        return { text: m.label, x, y }
    })
})

</script>

<template>
  <div class="profile-dashboard p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-[#42b883]/30 shadow-[0_0_20px_rgba(66,184,131,0.1)] transition-all duration-500">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-[#42b883] animate-pulse"></div>
        <h3 class="text-[#42b883] font-mono tracking-widest text-sm">SYSTEM_MONITOR</h3>
      </div>
      <div class="text-xs text-[#42b883]/60 font-mono">v3.0.1</div>
    </div>

    <!-- Active Context -->
    <div class="mb-8">
      <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Target Identity</div>
      <div class="text-2xl font-bold text-white leading-tight min-h-[3rem]">
        {{ experience?.role || 'SCANNING...' }}
      </div>
       <div class="text-sm text-[#42b883] mt-1 font-mono">
        {{ experience?.company || 'WAITING FOR INPUT' }}
      </div>
    </div>

    <!-- Growth Metric -->
    <div class="mb-10 group">
      <div class="flex justify-between items-end mb-2">
         <div class="text-xs text-gray-400 uppercase tracking-wider">{{ growthLabel }}</div>
         <div class="text-[#42b883] text-xs font-mono">DELTA</div>
      </div>

      <div class="relative">
        <div class="text-6xl font-black text-white tracking-tighter tabular-nums">
            {{ processedGrowth }}<span class="text-2xl text-[#42b883]/80">%</span>
        </div>
        <!-- Decorative Grid behind number -->
        <div class="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none"
             style="background-image: linear-gradient(#42b883 1px, transparent 1px), linear-gradient(90deg, #42b883 1px, transparent 1px); background-size: 10px 10px;">
        </div>
      </div>

      <div class="h-1.5 w-full bg-gray-800 mt-4 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-[#42b883] to-[#42ec9a] transition-all duration-700 ease-out"
               :style="{ width: Math.min(processedGrowth, 100) + '%' }"></div>
      </div>
    </div>

    <!-- Radar Chart -->
    <div class="radar-wrapper relative aspect-square w-full max-w-[280px] mx-auto opacity-80 hover:opacity-100 transition-opacity duration-300">
      <svg viewBox="0 0 220 220" class="w-full h-full overflow-visible">
         <!-- Background Grid (Concentric Circles) -->
         <circle cx="110" cy="110" r="100" fill="none" class="stroke-white/10" stroke-width="1"/>
         <circle cx="110" cy="110" r="75" fill="none" class="stroke-white/10" stroke-width="1"/>
         <circle cx="110" cy="110" r="50" fill="none" class="stroke-white/10" stroke-width="1"/>
         <circle cx="110" cy="110" r="25" fill="none" class="stroke-white/10" stroke-width="1"/>

         <!-- Axis Lines -->
         <path v-for="(m, i) in (experience?.radar || [])" :key="'line-'+i"
               :d="`M110 110 L${radarLabels[i]?.x} ${radarLabels[i]?.y}`"
               class="stroke-white/10" stroke-width="1" />

         <!-- The Data Polygon -->
         <polygon v-if="radarPoints" :points="radarPoints"
                  fill="rgba(66, 184, 131, 0.2)"
                  stroke="#42b883"
                  stroke-width="2"
                  class="filter drop-shadow-[0_0_8px_rgba(66,184,131,0.5)] transition-all duration-700 ease-out"/>

        <!-- Labels -->
        <text v-for="(lbl, i) in radarLabels" :key="'lbl-'+i"
              :x="lbl.x" :y="lbl.y"
              text-anchor="middle"
              dominant-baseline="middle"
              class="fill-gray-400 text-[10px] uppercase font-mono tracking-wider"
              style="text-shadow: 0 1px 2px black;">
          {{ lbl.text }}
        </text>
      </svg>
    </div>
  </div>
</template>
