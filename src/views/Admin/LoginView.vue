<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const password = ref('')
const error = ref('')
const isLoading = ref(false)

async function handleLogin() {
  isLoading.value = true
  error.value = ''

  // Fake network delay for effect
  await new Promise((resolve) => setTimeout(resolve, 1500))

  if (authStore.login(password.value)) {
    router.push('/admin')
  } else {
    error.value = 'ACCESS DENIED: Invalid Security Clearance'
  }
  isLoading.value = false
}
</script>

<template>
  <div
    class="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden"
  >
    <!-- Background Grid -->
    <div
      class="absolute inset-0 bg-[url('https://patterns.ibthemespro.com/res/lines.png')] opacity-10 pointer-events-none"
    ></div>

    <!-- Login Box -->
    <div
      class="w-full max-w-md bg-[#0a0a0c] border border-cyan-900/50 p-8 shadow-[0_0_50px_rgba(8,145,178,0.1)] relative z-10"
    >
      <!-- Decorative Borders -->
      <div class="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-500/50"></div>
      <div class="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-500/50"></div>

      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-white tracking-widest mb-2 font-mono">
          DORAEMON<br />C.M.S.
        </h1>
        <p class="text-[10px] text-cyan-500/50 tracking-[0.5em] uppercase">
          Confidential Management System
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="text-[10px] text-cyan-500 font-mono tracking-widest block mb-2"
            >SECURITY CODE</label
          >
          <input
            v-model="password"
            type="password"
            class="w-full bg-black/50 border border-cyan-900 text-cyan-400 font-mono text-center p-3 focus:outline-none focus:border-cyan-500 transition-colors tracking-[0.5em] placeholder-cyan-900/30"
            placeholder="••••••••"
            autofocus
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 font-mono py-4 hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-50 flex items-center justify-center group"
        >
          <span v-if="isLoading" class="animate-pulse">VERIFYING...</span>
          <span v-else class="group-hover:tracking-widest transition-all duration-300"
            >INITIATE // LOGIN</span
          >
        </button>

        <div
          v-if="error"
          class="text-red-500 text-xs font-mono text-center mt-4 border border-red-900/30 bg-red-900/10 p-2 animate-pulse"
        >
          ⚠ {{ error }}
        </div>
      </form>

      <div class="mt-8 text-center">
        <p class="text-[8px] text-gray-700 font-mono">
          UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED.<br />IP ADDRESS LOGGED.
        </p>
      </div>
    </div>
  </div>
</template>
