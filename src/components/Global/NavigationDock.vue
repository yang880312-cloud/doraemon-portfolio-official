<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDimensionStore } from '@/stores/dimension'
import { Home, Briefcase, Palette, User } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const store = useDimensionStore()

const currentDim = computed(() => store.currentDimension)

const navItems = [
  { id: 'LOBBY', label: 'Lobby', icon: Home, route: '/' },
  { id: 'PM', label: 'PM Logic', icon: Briefcase, route: '/pm' },
  { id: 'DESIGN', label: 'Design Magic', icon: Palette, route: '/design' },
  { id: 'PROFILE', label: 'Profile', icon: User, route: '/profile' },
]

function navigate(item) {
  // If we are in Lobby and targeting non-lobby, request animation
  if (route.name === 'lobby' && item.id !== 'LOBBY') {
    store.requestNavigation(item)
  } else {
    // Normal navigation
    router.push(item.route)
    store.setDimension(item.id)
  }
}
</script>

<template>
  <div class="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
    <div
      class="flex items-center gap-4 p-4 rounded-full glass-panel bg-black/60 border border-white/10 shadow-2xl backdrop-blur-md transition-all duration-300"
    >
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="navigate(item)"
        class="relative flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 group hover:bg-white/10 overflow-hidden"
        :class="{
          'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/50': currentDim === item.id,
          'text-gray-400': currentDim !== item.id,
        }"
      >
        <component :is="item.icon" size="20" />
        <span class="text-sm font-medium tracking-wide whitespace-nowrap">{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>
