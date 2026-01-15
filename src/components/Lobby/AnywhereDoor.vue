<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const emit = defineEmits(['click'])

function toggleDoor() {
  if (!isOpen.value) {
    // If closed, emit click to let parent handle logic (e.g. show tooltip)
    emit('click')
  }
}

function open() {
  isOpen.value = true
}

defineExpose({ open, isOpen })
</script>

<template>
  <div class="door-container perspective-1000" @click="toggleDoor">
    <div
      class="door-frame w-48 h-80 bg-pink-700 rounded-lg relative border-4 border-pink-900 shadow-[0_0_50px_rgba(255,105,180,0.5)]"
    >
      <!-- The Door Leaf -->
      <div
        class="door-leaf absolute inset-0 bg-door-pink rounded-lg origin-left transition-transform duration-1000 ease-in-out border-r-4 border-pink-400 flex items-center justify-end pr-4"
        :class="{ open: isOpen }"
      >
        <!-- Knob -->
        <div class="w-4 h-4 rounded-full bg-yellow-400 shadow-sm"></div>
      </div>

      <!-- The Void (Behind the door) -->
      <div
        class="door-void absolute inset-2 bg-black overflow-hidden rounded opacity-0 transition-opacity duration-300 delay-300"
        :class="{ 'opacity-100': isOpen }"
      >
        <div
          class="stars absolute inset-0 animate-pulse bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"
        ></div>
        <div
          class="absolute inset-0 flex items-center justify-center text-xs text-white/50 tracking-widest"
        >
          WAITING FOR<br />COMMAND
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.door-leaf {
  transform-style: preserve-3d;
  z-index: 2;
}
.door-leaf.open {
  transform: rotateY(-130deg);
}
</style>
