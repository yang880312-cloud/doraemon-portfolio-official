<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDataStore } from '@/stores/dataStore'
import { Plus, Edit2, Trash2, User, RefreshCw } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const dataStore = useDataStore()

onMounted(() => {
  dataStore.fetchProjects()
})

const projects = computed(() => dataStore.getAllProjects())

function handleLogout() {
  authStore.logout()
  router.push({ name: 'admin-login' })
}
</script>

<template>
  <div class="h-full w-full overflow-y-auto bg-[#050505] text-white font-mono p-8 custom-scrollbar">
    <header class="flex justify-between items-center mb-12 border-b border-white/10 pb-4">
      <div>
        <h1 class="text-2xl font-bold text-cyan-400">DORAEMON 控制中樞</h1>
        <p class="text-xs text-gray-500 flex items-center gap-2">
          系統狀態 (Status):
          <span v-if="dataStore.isLoading" class="text-yellow-500 animate-pulse"
            >連線中 (SYNCING...)</span
          >
          <span v-else class="text-green-500">線上 (ONLINE)</span>
          <button @click="dataStore.fetchProjects(true)" class="p-1 hover:text-white" title="刷新">
            <RefreshCw class="w-3 h-3" />
          </button>
        </p>
      </div>
      <button
        @click="handleLogout"
        class="text-xs border border-red-900/50 text-red-500 px-4 py-2 hover:bg-red-900/20"
      >
        登出系統
      </button>
    </header>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div class="bg-gray-900/50 border border-white/10 p-6 relative overflow-hidden group">
        <div
          class="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
        ></div>
        <h3 class="text-gray-500 text-xs uppercase mb-2">專案總數</h3>
        <p class="text-4xl font-mono text-cyan-400 relative z-10">{{ projects.length }}</p>
      </div>
      <!-- Database Status -->
      <div class="bg-gray-900/50 border border-white/10 p-6 group">
        <h3 class="text-gray-500 text-xs uppercase mb-2">資料庫連線</h3>
        <p class="text-4xl text-green-500 text-lg pt-2">[ SUPABASE ACTIVE ]</p>
      </div>
      <router-link
        to="/admin/profile"
        class="bg-gray-900/50 border border-white/10 p-6 flex flex-col justify-center items-center cursor-pointer hover:bg-cyan-900/20 group"
      >
        <User class="text-pink-500 mb-2 group-hover:scale-125 transition-transform" />
        <span class="text-pink-400 text-sm">編輯個人履歷</span>
      </router-link>
      <router-link
        :to="{ name: 'admin-project-editor' }"
        class="bg-gray-900/50 border border-white/10 p-6 flex flex-col justify-center items-center cursor-pointer hover:bg-cyan-900/20 group"
      >
        <Plus class="text-cyan-500 mb-2 group-hover:scale-125 transition-transform" />
        <span class="text-cyan-400 text-sm">建立新專案</span>
      </router-link>
    </div>

    <!-- Project List -->
    <div>
      <h2
        class="text-gray-500 text-xs uppercase mb-6 tracking-widest pl-2 border-l-2 border-cyan-500"
      >
        管理專案列表
      </h2>

      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="project in projects"
          :key="project.id"
          class="bg-gray-900/30 border border-gray-800 p-4 flex items-center gap-6 hover:border-cyan-500/50 transition-colors group"
        >
          <!-- Thumbnail -->
          <div
            class="w-28 h-16 bg-black border border-gray-700 overflow-hidden shrink-0 aspect-video"
          >
            <img
              :src="project.image"
              class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
            />
          </div>

          <!-- Info -->
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span
                class="text-[10px] px-1 py-0.5 border rounded"
                :class="
                  project.type === 'PM'
                    ? 'border-cyan-500 text-cyan-500'
                    : 'border-pink-500 text-pink-500'
                "
              >
                {{ project.type === 'PM' ? '理性 PM' : '感性 Design' }}
              </span>
              <h3 class="font-bold text-lg">{{ project.title }}</h3>
            </div>
            <p class="text-xs text-gray-500 truncate max-w-lg">{{ project.description }}</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity px-4">
            <router-link
              :to="{ name: 'admin-project-editor', params: { id: project.id } }"
              class="p-2 hover:bg-white/10 rounded-full text-cyan-400"
              title="編輯"
            >
              <Edit2 size="16" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
