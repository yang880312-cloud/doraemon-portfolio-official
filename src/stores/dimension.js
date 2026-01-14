import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useDimensionStore = defineStore('dimension', () => {
  // Dimensions: 'LOBBY', 'PM', 'DESIGN', 'PROFILE'
  const currentDimension = ref('LOBBY')
  const isTransitioning = ref(false)

  // Actions
  function setDimension(dim) {
    if (currentDimension.value === dim) return
    currentDimension.value = dim
  }

  function startTransition() {
    isTransitioning.value = true
  }

  function endTransition() {
    isTransitioning.value = false
  }

  return { 
    currentDimension, 
    isTransitioning,
    setDimension,
    startTransition,
    endTransition
  }
})
