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
      class="flex items-center gap-4 p-2 pl-6 pr-6 rounded-full glass-panel bg-white/80 border border-white/40 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-105"
    >
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="navigate(item)"
        class="relative flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 group hover:bg-blue-100/50 overflow-hidden"
        :class="{
          'bg-blue-500 text-white shadow-lg': currentDim === item.id,
          'text-slate-600 hover:text-blue-600': currentDim !== item.id,
        }"
      >
        <component :is="item.icon" size="20" />
        <span class="text-sm font-bold tracking-wide whitespace-nowrap" v-if="currentDim === item.id">{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>
