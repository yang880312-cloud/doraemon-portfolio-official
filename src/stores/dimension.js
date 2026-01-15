import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useDimensionStore = defineStore('dimension', () => {
  // Dimensions: 'LOBBY', 'PM', 'DESIGN', 'PROFILE'
  const currentDimension = ref('LOBBY')
  const isTransitioning = ref(false)
  const navigationRequest = ref(null)

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

  function requestNavigation(target) {
    navigationRequest.value = target
  }

  function clearRequest() {
    navigationRequest.value = null
  }

  return {
    currentDimension,
    isTransitioning,
    navigationRequest,
    setDimension,
    startTransition,
    endTransition,
    requestNavigation,
    clearRequest,
  }
})
