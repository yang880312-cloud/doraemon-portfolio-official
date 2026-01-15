<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['item-click'])

// Duplicate items to ensure smooth infinite scroll even with few items
const displayItems = computed(() => {
  const base = props.items || []
  if (base.length === 0) return []

  let result = [...base]
  // Triple the data to ensure we have enough for 3 long rows
  while (result.length < 20) {
    result = [...result, ...base]
  }
  // Double it for the seam loop
  return [...result, ...result]
})

// Row 2 Offset (33% shift)
const row2Items = computed(() => {
  const items = [...displayItems.value]
  const shiftAmount = Math.floor(items.length * 0.33)
  return [...items.slice(shiftAmount), ...items.slice(0, shiftAmount)]
})

// Row 3 Offset (66% shift)
const row3Items = computed(() => {
  const items = [...displayItems.value]
  const shiftAmount = Math.floor(items.length * 0.66)
  return [...items.slice(shiftAmount), ...items.slice(0, shiftAmount)]
})
</script>

<template>
  <!--
    Layout: 3 Rows. Tighter spacing (gap-4, py-6).
    Effect: RGB Flowing Border on Hover (Instant In).
    Clipping: overflow-visible.
  -->
  <div
    class="w-full h-full flex flex-col justify-center gap-4 overflow-hidden py-4 pb-32 bg-[#050505] group/wall perspective-1000"
  >
    <!-- Row 1 (Normal) -->
    <div class="marquee-track py-2">
      <div class="marquee-content animate-marquee group-hover/wall:paused gap-6 flex px-4">
        <div
          v-for="(item, index) in displayItems"
          :key="`r1-${index}`"
          class="relative shrink-0 w-[450px] aspect-video group/card cursor-pointer transition-transform duration-500 ease-out"
          @click="emit('item-click', item)"
        >
          <!-- RGB Border Container (Offset for glow) -->
          <!-- Instant In (duration-0), Slow Out (duration-500) -->
          <div
            class="absolute -inset-[3px] rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 group-hover/card:duration-0 blur-md bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 animate-gradient-fast"
          ></div>

          <!-- Card Content -->
          <div
            class="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden transition-all duration-500 ease-out group-hover/wall:opacity-40 group-hover/wall:grayscale group-hover/wall:scale-95 group-hover/card:!opacity-100 group-hover/card:!grayscale-0 group-hover/card:!scale-105 group-hover/card:z-50 border border-white/10 group-hover/card:border-transparent"
          >
            <img
              :src="item.image"
              loading="lazy"
              class="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 transition-opacity duration-500"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex items-end p-6"
            >
              <h3
                class="text-white font-bold text-2xl tracking-tight transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500"
              >
                {{ item.title }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 2 (Offset -225px) -->
    <div class="marquee-track py-2" style="margin-left: -225px">
      <div class="marquee-content animate-marquee group-hover/wall:paused gap-6 flex px-4">
        <div
          v-for="(item, index) in row2Items"
          :key="`r2-${index}`"
          class="relative shrink-0 w-[450px] aspect-video group/card cursor-pointer transition-transform duration-500 ease-out"
          @click="emit('item-click', item)"
        >
          <!-- RGB Border -->
          <div
            class="absolute -inset-[3px] rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 group-hover/card:duration-0 blur-md bg-gradient-to-r from-yellow-500 via-green-500 to-cyan-500 animate-gradient-fast"
          ></div>

          <div
            class="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden transition-all duration-500 ease-out group-hover/wall:opacity-40 group-hover/wall:grayscale group-hover/wall:scale-95 group-hover/card:!opacity-100 group-hover/card:!grayscale-0 group-hover/card:!scale-105 group-hover/card:z-50 border border-white/10 group-hover/card:border-transparent"
          >
            <img
              :src="item.image"
              loading="lazy"
              class="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 transition-opacity duration-500"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex items-end p-6"
            >
              <h3
                class="text-white font-bold text-2xl tracking-tight transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500"
              >
                {{ item.title }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 3 (Aligned) -->
    <div class="marquee-track py-2">
      <div class="marquee-content animate-marquee group-hover/wall:paused gap-6 flex px-4">
        <div
          v-for="(item, index) in row3Items"
          :key="`r3-${index}`"
          class="relative shrink-0 w-[450px] aspect-video group/card cursor-pointer transition-transform duration-500 ease-out"
          @click="emit('item-click', item)"
        >
          <!-- RGB Border -->
          <div
            class="absolute -inset-[3px] rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 group-hover/card:duration-0 blur-md bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-500 animate-gradient-fast"
          ></div>

          <div
            class="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden transition-all duration-500 ease-out group-hover/wall:opacity-40 group-hover/wall:grayscale group-hover/wall:scale-95 group-hover/card:!opacity-100 group-hover/card:!grayscale-0 group-hover/card:!scale-105 group-hover/card:z-50 border border-white/10 group-hover/card:border-transparent"
          >
            <img
              :src="item.image"
              loading="lazy"
              class="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 transition-opacity duration-500"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex items-end p-6"
            >
              <h3
                class="text-white font-bold text-2xl tracking-tight transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500"
              >
                {{ item.title }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee-track {
  width: 100%;
  overflow: visible;
  position: relative;
  display: flex;
}

.marquee-content {
  display: flex;
}

.animate-marquee {
  animation: marquee 300s linear infinite;
}

.group:hover .animate-marquee,
.group\/wall:hover .animate-marquee {
  animation-play-state: paused;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes gradient-xy {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
.animate-gradient-fast {
  background-size: 200% 200%;
  animation: gradient-xy 1s linear infinite; /* Faster flow for electric feel */
}
</style>
