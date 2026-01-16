import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoggedIn = ref(false)

  // Initialize: Check active session
  async function checkUser() {
    const { data } = await supabase.auth.getSession()
    if (data.session?.user) {
      user.value = data.session.user
      isLoggedIn.value = true
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user || null
      isLoggedIn.value = !!session
    })
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return true
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    isLoggedIn.value = false
  }

  return {
    user,
    isLoggedIn,
    login,
    logout,
    checkUser,
  }
})
