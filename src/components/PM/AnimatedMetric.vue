<script setup>
import { ref, onMounted, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  value: {
    type: [String, Number],
    required: true
  },
  label: {
      type: String,
      default: ''
  }
})

const displayValue = ref(0)
const suffix = ref('')
const prefix = ref('')
const isNumeric = ref(false)
const rawValue = ref('')

function parseValue(val) {
    const str = String(val)
    // Match optional sign, number (int/float), and optional everything else
    const match = str.match(/^([+\-]?)([\d,.]+)(.*)$/)

    if (match && !isNaN(parseFloat(match[2].replace(/,/g, '')))) {
        isNumeric.value = true
        prefix.value = match[1] || ''
        suffix.value = match[3] || ''
        return parseFloat(match[2].replace(/,/g, ''))
    }

    isNumeric.value = false
    rawValue.value = str
    return 0
}

function animate() {
    const target = parseValue(props.value)
    if (!isNumeric.value) return

    // Reset for animation
    displayValue.value = 0

    gsap.to(displayValue, {
        value: target,
        duration: 1.5,
        ease: 'power2.out',
    })
}

onMounted(() => {
    animate()
})

watch(() => props.value, () => {
    animate()
})
</script>

<template>
  <div class="text-center group/metric flex-1 min-w-[100px]">
    <div class="flex items-baseline justify-center gap-1 mb-1">
      <!-- Numeric Display -->
      <template v-if="isNumeric">
          <span class="text-3xl md:text-5xl font-black text-[#ef4444] font-mono tracking-tighter drop-shadow-sm">
             {{ prefix }}{{ Number.isInteger(displayValue) ? displayValue : displayValue.toFixed(0) }}
          </span>
          <span class="text-base md:text-xl font-bold text-[#ef4444] font-mono opacity-80">
              {{ suffix }}
          </span>
      </template>

      <!-- Non-Numeric Fallback -->
      <template v-else>
          <span class="text-2xl md:text-4xl font-black text-[#ef4444] font-mono tracking-tighter drop-shadow-sm">
             {{ rawValue }}
          </span>
      </template>
    </div>
    <div class="text-[10px] md:text-xs font-bold text-[#64748b] tracking-[0.2em] uppercase">{{ label }}</div>
  </div>
</template>
