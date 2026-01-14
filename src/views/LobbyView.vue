<script setup>
// Lobby View Container
import AnywhereDoor from '@/components/Lobby/AnywhereDoor.vue'
import PhysicsWorld from '@/components/Lobby/PhysicsWorld.vue'
import LobbyCursor from '@/components/Lobby/LobbyCursor.vue'
</script>

<template>
  <div class="relative w-full h-full bg-void-black">
    <!-- 1. Physics World (Background / Interactive Layer) -->
    <LobbyCursor />
    <PhysicsWorld />

    <!-- 2. UI Overlay (Title, Door) -->
    <div class="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
      
      <!-- Hero Title -->
      <div class="absolute top-[15%] text-center pointer-events-auto">
        <h1 class="text-6xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse">
          DORAEMON<br>PORTFOLIO
        </h1>
        <p class="text-sm uppercase tracking-[0.3em] opacity-70 text-blue-200">
          Logic & Magic
        </p>
      </div>

      <!-- The Door -->
      <div class="pointer-events-auto mt-20">
        <AnywhereDoor />
      </div>

    </div>
  </div>
</template>
