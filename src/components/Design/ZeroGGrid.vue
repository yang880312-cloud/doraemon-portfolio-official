<script setup>
import { ref, nextTick, watch, onMounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  items: Array,
})

const emit = defineEmits(['item-click', 'deal-start'])

// 3D Magnetic Tilt Logic
const cardRefs = ref([])
const isDealt = ref(false)
const deckStyles = ref([])

function generateDeckStyles() {
    // Determine stack height based on items (max 20)
    const count = Math.min(props.items.length, 25)
    // Create array of styles.
    // We want the TOP cards to be near 0,0 and BOTTOM cards to be displaced.
    // Actually, usually index 0 is bottom in DOM order logic if not using z-index properly.
    // In my template, z-index is 'i'. So i=0 is bottom. i=count-1 is top.

    // Bottom cards (i=0) should be lower. Top cards (i=max) should be higher?
    // Wait, physically: Bottom card is on the table. Top card is on stack.
    // If I use absolute positioning:
    // i=0 (Bottom): TranslateY = 0? Or TranslateY = Max?
    // Let's say we look from top.
    // Top card (Cover) is separate div z-50.
    // The loop `v-for="(style, i) in deckStyles"` creates the UNDERNEATH cards.
    // So if I want 20 cards UNDER the top card.

    const styles = []
    for (let i = 0; i < count; i++) {
        // i=0 is furthest bottom card.
        // It should be shifted DOWN (positive Y) and maybe slightly random X/Rotation.
        // As i increases (closer to top), shift decreases to 0.

        // Reverse logic: i=0 is the card immediately below the Top Card?
        // Let's assume the loop renders cards *below* the main cover.
        // So we want them to "stick out".

        // Let's make i=0 the bottom-most card.
        // It should have largest offset.
        // i = count-1 is the card just under the cover.

        // Offset Calculation:
        // Each card adds ~1px thickness (translateY).
        // Also random rotation to make it messy.

        // Let's try:
        // i goes from 0 to count-1.
        // Card i:
        // Y = (count - i) * 1.5 (pixels down)
        // Rotation = Random small angle

        const offset = (count - i) * 1.2
        const rotation = (Math.random() * 4 - 2) // -2 to 2 deg
        const randomX = (Math.random() * 2 - 1)

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

        // Calculate center of screen for "From" position
        // Since the deck is fixed center, we just use window center
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2

        gsap.fromTo(cardRefs.value,
            {
                // We want them to fly OUT from the center
                // But since they are in grid flow, we use x/y to offset them
                // This is a bit tricky with offsets.
                // Simpler: use set to fixed center, then to grid.
                // But getting their natural grid position is hard if they are fixed.
                // Strategy: Use 'from' logic. We assume they are at their final position (because opacity 1 in DOM),
                // and we animate 'from' the center.
                x: (i, target) => {
                    const rect = target.getBoundingClientRect()
                    return centerX - (rect.left + rect.width/2)
                },
                y: (i, target) => {
                    const rect = target.getBoundingClientRect()
                    return centerY - (rect.top + rect.height/2)
                },
                scale: 0.1,
                rotation: () => Math.random() * 180 - 90, // Crazy spin
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

function handleMouseMove(e, index) {
  if (window.innerWidth < 768) return // Disable 3D tilt on mobile
  const card = cardRefs.value[index]
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  // Calculate rotation (max 12 degrees for visible but smooth effect)
  const rotateX = ((y - centerY) / centerY) * -12
  const rotateY = ((x - centerX) / centerX) * 12

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
}

function handleMouseLeave(index) {
  const card = cardRefs.value[index]
  if (!card) return

  card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
}

// Map layout keywords to Tailwind col/row spans + Aspect Ratios
// Defaulting to aspect-square to ensure 1:1 unless specified otherwise
// Map layout keywords to Tailwind col/row spans + Aspect Ratios
// Defaulting to aspect-square to ensure 1:1 unless specified otherwise
function getSpanClass(layout) {
  switch (layout) {
    case 'wide': return 'md:col-span-2 md:row-span-1 aspect-[2/1]'
    case 'tall': return 'md:col-span-1 md:row-span-2 aspect-[1/2]'
    case 'big': return 'md:col-span-2 md:row-span-2 aspect-square'
    default: return 'md:col-span-1 md:row-span-1 aspect-square' // standard 1:1
  }
}
</script>

<template>
  <div class="relative w-full h-full overflow-y-auto custom-scrollbar p-4 md:p-16 pb-32">

    <!-- Interaction Layer: The Deck Stack -->
    <!-- Only visible if not dealt yet and we have items -->
    <div
      v-if="!isDealt && items.length > 0"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-700"
    >
        <!-- Deck Container -->
        <!-- Removed -mt-20 to fix click area alignment. Increased size slightly. -->
        <div class="relative w-[320px] h-[480px] cursor-pointer group hover:scale-105 transition-transform duration-300 ease-out will-change-transform perspective-1000 pointer-events-auto" @click.stop="dealCards">
             <!-- CLICK HINT PULSE BEHIND -->
             <div class="absolute inset-0 bg-blue-500/20 rounded-xl blur-2xl animate-pulse-slow"></div>

            <!-- DYNAMIC THICKNESS LAYERS -->
            <!-- Render a card for each item, up to 20, to create realistic pile volume -->
            <div
                v-for="(style, i) in deckStyles"
                :key="`stack-${i}`"
                class="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-xl border border-white/10 shadow-sm"
                :style="{
                    backgroundImage: `url('/src/assets/custom-deck-back.jpg')`,
                    transform: style.transform,
                    zIndex: i,
                    opacity: 1 - (i * 0.02), // Slight fade for bottom ones
                    filter: `brightness(${0.5 + (i * 0.02)})` // Darker at bottom
                }"
            ></div>

            <!-- Top Card (The Active Deck Cover) -->
            <div class="absolute inset-0 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/20 bg-[#0a0a0a] z-50 transition-transform duration-300 group-hover:-translate-y-2">
                <img src="/src/assets/custom-deck-back.jpg" alt="Deck" class="w-full h-full object-cover rounded-xl" />

                <!-- Sheen -->
                <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
        </div>
    </div>

    <!-- Zero-G Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 max-w-[1600px] mx-auto min-h-[50vh]">

      <div
        v-for="(item, index) in items"
        :key="item.id"
        :ref="el => cardRefs[index] = el"
        @mousemove="(e) => handleMouseMove(e, index)"
        @mouseleave="handleMouseLeave(index)"
        @click="$emit('item-click', item)"
        class="relative group rounded-3xl cursor-pointer md:cursor-none transition-all duration-300 ease-out preserve-3d"
        :class="[getSpanClass(item.layout), isDealt ? 'opacity-100' : 'opacity-0']"
      >
        <!-- Aura Glow (Behind) -->
        <div
            class="absolute -inset-2 rounded-[2.5rem] opacity-0 group-hover:opacity-70 blur-xl transition-opacity duration-500 will-change-opacity"
            :style="{ backgroundColor: item.theme_color || '#8b5cf6' }"
        ></div>

        <!-- Magnetic Card Body -->
        <div class="relative w-full h-full rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/10 group-hover:border-white/40 transition-colors z-10 box-border">

            <!-- Tech Corners (HUD Effect - Top Left) -->
            <div class="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/30 rounded-tl-sm z-20 group-hover:border-white/90 group-hover:w-6 group-hover:h-6 transition-all duration-300"></div>
            <!-- Tech Corners (HUD Effect - Bottom Right) -->
            <div class="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/30 rounded-br-sm z-20 group-hover:border-white/90 group-hover:w-6 group-hover:h-6 transition-all duration-300"></div>

            <!-- Project ID (Tech Label) -->
            <div class="absolute top-4 right-4 z-20 font-mono text-[9px] tracking-widest text-white/30 group-hover:text-white/80 transition-colors">
               ID-{{ (index + 1).toString().padStart(3, '0') }} // {{ item.layout?.toUpperCase() || 'STD' }}
            </div>

            <!-- Full Bleed Image -->
            <img
                :src="item.image"
                loading="lazy"
                class="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out md:grayscale group-hover:grayscale-0"
                alt="Project Thumbnail"
            />

            <!-- Glass Overlay (Info Reveal) -->
            <!-- RWD: Show overlay ALWAYS on mobile, Hover on desktop -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <!-- Theme Line -->
                <div class="w-12 h-0.5 mb-3" :style="{ backgroundColor: item.theme_color || '#fff' }"></div>

                <span
                    class="text-[9px] font-mono uppercase tracking-[0.2em] text-white/70 mb-1"
                >
                    {{ item.category || 'EXHIBIT' }}
                </span>
                <h3 class="text-xl md:text-2xl font-bold text-white leading-none tracking-tight">
                    {{ item.title }}
                </h3>
            </div>
        </div>

      </div>
    </div>

    <!-- Empty State -->
    <div v-if="items.length === 0" class="flex flex-col items-center justify-center py-20 text-white/20 font-mono">
       <div class="w-16 h-16 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center mb-4 animate-spin-slow">
         <span class="text-2xl">⚡</span>
       </div>
       <p class="tracking-[0.2em] text-xs uppercase">Sector Offline / No Data</p>
    </div>
  </div>
</template>

<style scoped>
.preserve-3d {
    transform-style: preserve-3d;
    backface-visibility: hidden;
    will-change: transform;
}

/* Scrollbar Hiding for immersive feel */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #222;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #444;
}
</style>
