<script setup>
import { ref, nextTick, watch, onMounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  items: Array,
})

const emit = defineEmits(['item-click', 'deal-start'])

const cardRefs = ref([])
const isDealt = ref(false)
const deckStyles = ref([])

function generateDeckStyles() {
    const count = Math.min(props.items.length || 0, 25)
    // If no items, skip style gen
    if (count === 0) return

    const styles = []
    for (let i = 0; i < count; i++) {
        const offset = (count - i) * 4.5
        const rotation = (Math.random() * 6 - 3)
        const randomX = (Math.random() * 4 - 2)
        styles.push({
            transform: `translate(${randomX}px, ${offset}px) rotate(${rotation}deg)`
        })
    }
    deckStyles.value = styles
}

watch(() => props.items, () => {
    generateDeckStyles()
}, { immediate: true })

function dealCards() {
    isDealt.value = true
    emit('deal-start')

    nextTick(() => {
        if (cardRefs.value.length === 0) return

        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2

        gsap.fromTo(cardRefs.value,
            {
                x: (i, target) => {
                    const rect = target.getBoundingClientRect()
                    return centerX - (rect.left + rect.width/2)
                },
                y: (i, target) => {
                    const rect = target.getBoundingClientRect()
                    return centerY - (rect.top + rect.height/2)
                },
                scale: 0.1,
                rotation: () => Math.random() * 180 - 90,
                opacity: 0,
                z: -500
            },
            {
                duration: 0.8,
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                opacity: 1,
                z: 0,
                stagger: {
                    amount: 0.6,
                    grid: "auto",
                    from: "center"
                },
                ease: "back.out(1.2)",
                clearProps: "all"
            }
        )
    })
}

// Simple span class utility
function getSpanClass(layout) {
  switch (layout) {
    case 'wide': return 'md:col-span-2 md:row-span-1 aspect-[2/1]'
    case 'tall': return 'md:col-span-1 md:row-span-2 aspect-[1/2]'
    case 'big': return 'md:col-span-2 md:row-span-2 aspect-square'
    default: return 'md:col-span-1 md:row-span-1 aspect-square'
  }
}
</script>

<template>
  <div class="relative w-full p-4 md:p-16 pb-32">
    <!-- Interaction Layer: The Deck Stack -->
    <div
      v-if="!isDealt && items.length > 0"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-700"
    >
        <div class="relative w-[320px] h-[480px] cursor-pointer group hover:scale-105 transition-transform duration-300 ease-out z-[60] pointer-events-auto" @click.stop="dealCards">
             <div class="absolute inset-0 bg-blue-500/20 rounded-xl blur-2xl animate-pulse-slow"></div>
            <div
                v-for="(style, i) in deckStyles"
                :key="`stack-${i}`"
                class="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-xl border border-white/40 shadow-lg"
                :style="{
                    backgroundImage: `url('/src/assets/custom-deck-back.jpg')`,
                    transform: style.transform,
                    zIndex: i,
                    filter: `brightness(${0.7 + (i * 0.01)})`
                }"
            ></div>
            <div class="absolute inset-0 rounded-xl shadow-2xl border border-white/20 bg-[#0a0a0a] z-50 group-hover:-translate-y-2 transition-transform duration-300">
                <img src="/src/assets/custom-deck-back.jpg" alt="Deck" class="w-full h-full object-cover rounded-xl" />
            </div>
        </div>
    </div>

    <!-- Zero-G Grid (Simplified for Stability: No 3D, High Z-Index) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 max-w-[1600px] mx-auto min-h-[50vh]">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        :ref="el => cardRefs[index] = el"
        @click="$emit('item-click', item)"
        class="relative group rounded-3xl cursor-pointer transition-all duration-300 ease-out z-30 overflow-hidden bg-[#0d0d0d] border border-white/10 hover:border-white/40 shadow-lg hover:shadow-cyan-500/20"
        :class="[getSpanClass(item.layout), isDealt ? 'opacity-100' : 'opacity-0']"
      >
            <!-- Project ID -->
            <div class="absolute top-4 right-4 z-20 font-mono text-[9px] tracking-widest text-white/30 group-hover:text-white/80 transition-colors">
               ID-{{ (index + 1).toString().padStart(3, '0') }}
            </div>

            <!-- Image -->
            <img
                :src="item.image"
                loading="lazy"
                class="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                alt="Project Thumbnail"
            />

            <!-- Simple Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span class="text-[9px] font-mono uppercase tracking-[0.2em] text-white/70 mb-1">
                    {{ item.category || 'EXHIBIT' }}
                </span>
                <h3 class="text-xl md:text-2xl font-bold text-white leading-none tracking-tight">
                    {{ item.title }}
                </h3>
            </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="items.length === 0" class="flex flex-col items-center justify-center py-20 text-white/20 font-mono">
       <span class="text-2xl mb-4">⚡</span>
       <p class="tracking-[0.2em] text-xs uppercase">Sector Offline / No Data</p>
    </div>
  </div>
</template>

<style scoped>
/* Ensure no scrollbar internally */
</style>
