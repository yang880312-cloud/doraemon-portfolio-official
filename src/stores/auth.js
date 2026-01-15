import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const isAuthenticated = ref(false)

  function login(password) {
    // MOCK LOGIN: Hardcoded password for now
    if (password === 'doraemon') {
      isAuthenticated.value = true
      return true
    }
    return false
  }

  function logout() {
    isAuthenticated.value = false
    // We typically handle redirect in the component, but state is cleared here
  }

  return { isAuthenticated, login, logout }
})
