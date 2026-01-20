<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '@/stores/dataStore'

import BentoCard from '@/components/PM/BentoCard.vue'
import ImageUploader from '@/components/Admin/ImageUploader.vue'
import GalleryUploader from '@/components/Admin/GalleryUploader.vue'

const route = useRoute()
const router = useRouter()
const store = useDataStore()

const isNew = computed(() => !route.params.id)
const formData = ref({
  id: null,
  title: '',
  category: 'Logic', // Logic (PM) or Magic (Design)
  type: 'PM', // PM or DESIGN
  description: '',
  image: '',
  images: [], // For Gallery
  mood: '', // For Design
  pm_metrics: {
    // For PM
    users: '',
    revenue: '',
  },
  tags: [],
})

// Initialize
// Initialize
onMounted(async () => {
  if (!isNew.value) {
    // Ensure we have data
    if (store.projects.length === 0) {
      await store.fetchProjects()
    }

    const existing = store.getProjectById(route.params.id)
    if (existing) {
      // Deep copy to avoid mutating store directly before save
      formData.value = JSON.parse(JSON.stringify(existing))
      // Ensure images is array to prevent "not iterable" error in GalleryUploader
      if (!formData.value.images) formData.value.images = []
      // Ensure pm_metrics structure exists
      if (!formData.value.pm_metrics) formData.value.pm_metrics = {}
      if (!formData.value.pm_metrics._details) formData.value.pm_metrics._details = {}
    }
  } else {
    // New project initialization
     formData.value.images = []
     formData.value.pm_metrics = {
       users: '', revenue: '',
       _details: { problem: '', solution: '', tech: [], impact: '', repo: '' }
     }
  }
})

// Computed for comma-separated tech stack
const techStackInput = computed({
  get: () => {
     const tech = formData.value.pm_metrics?._details?.tech
     return Array.isArray(tech) ? tech.join(', ') : ''
  },
  set: (val) => {
    // Ensure initialization
    if (!formData.value.pm_metrics) formData.value.pm_metrics = {}
    if (!formData.value.pm_metrics._details) formData.value.pm_metrics._details = {}

    // Split by comma and clean whitespace
    formData.value.pm_metrics._details.tech = val.split(',').map(s => s.trim()).filter(Boolean)
  }
})

function fillTemplate() {
  if (formData.value.type === 'PM') {
    formData.value = {
      ...formData.value,
      title: 'New Logic Project',
      category: 'B2B SaaS',
      image: 'https://placehold.co/600x400/004466/ffffff?text=Logic',
      description: 'A revolutionary system optimizing data flow.',
      pm_metrics: { users: '1M+', revenue: '$500k' },
      tags: ['Vue', 'Data', 'Optimized'],
    }
  } else {
    formData.value = {
      ...formData.value,
      title: 'New Magic Design',
      category: 'Visual Art',
      image:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
      ],
      description: 'An immersive visual experience challenging perception.',
      mood: 'Ethereal',
    }
  }
}

async function save() {
  if (isNew.value) {
    await store.addProject(formData.value)
  } else {
    await store.updateProject(formData.value)
  }
  router.push('/admin')
}

async function remove() {
  if (confirm('Permanently delete this project?')) {
    await store.deleteProject(formData.value.id)
    router.push('/admin')
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white p-8 font-sans">
    <!-- Heavy Header -->
    <header class="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
      <div>
        <h1 class="text-2xl font-bold font-mono text-cyan-400">
          {{ isNew ? '建立新專案' : '編輯專案' }}
        </h1>
        <p class="text-xs text-gray-500 font-mono tracking-widest mt-1">
          專案 ID: {{ formData.id || '自動生成' }}
        </p>
      </div>
      <div class="flex gap-4">
        <button
          v-if="!isNew"
          @click="remove"
          class="text-red-500 hover:text-red-400 text-xs font-mono px-4 py-2 border border-red-900/50"
        >
          刪除專案
        </button>
        <button
          @click="router.push('/admin')"
          class="text-gray-400 hover:text-white text-xs font-mono px-4 py-2"
        >
          取消
        </button>
        <button
          @click="save"
          class="bg-cyan-600 text-black font-bold text-xs font-mono px-6 py-2 hover:bg-cyan-500"
        >
          儲存變更
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 h-[calc(100vh-150px)]">
      <!-- LEFT: Editor Form -->
      <div class="overflow-y-auto pr-4 space-y-8 custom-scrollbar">
        <!-- Type Selection -->
        <div class="p-4 bg-gray-900/30 border border-gray-800 rounded">
          <label class="block text-xs font-mono text-cyan-500 mb-2">專案類型 (ENTITY TYPE)</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="formData.type" value="PM" class="text-cyan-500" />
              <span class="text-sm">理性邏輯 (PM)</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="formData.type" value="DESIGN" class="text-pink-500" />
              <span class="text-sm">感性魔法 (Design)</span>
            </label>
            <button
              @click="fillTemplate"
              class="ml-auto text-xs text-cyan-400 border border-cyan-500/30 px-2 py-1 hover:bg-cyan-500/10"
            >
              ✨ 一鍵帶入範本
            </button>
          </div>
        </div>

        <!-- Basic Info -->
        <div class="space-y-4">
          <div>
            <label class="block text-xs text-gray-500 mb-1">專案標題 (TITLE)</label>
            <input
              v-model="formData.title"
              class="w-full bg-black border border-gray-700 p-2 text-lg focus:border-cyan-500 outline-none"
              placeholder="請輸入專案名稱"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-gray-500 mb-1">分類 (CATEGORY)</label>
              <input
                v-model="formData.category"
                class="w-full bg-black border border-gray-700 p-2 text-sm focus:border-cyan-500 outline-none"
                placeholder="e.g. B2B SaaS"
              />
            </div>
             <div v-if="formData.type === 'PM'">
               <label class="block text-xs text-gray-500 mb-1">主題色 (THEME COLOR)</label>
               <div class="flex gap-2">
                 <input
                  v-model="formData.pm_metrics._theme_color"
                  type="color"
                  class="h-9 w-9 bg-transparent border-0 cursor-pointer"
                />
                <input
                  v-model="formData.pm_metrics._theme_color"
                  class="flex-1 bg-black border border-gray-700 p-2 text-sm font-mono text-cyan-500"
                  placeholder="#1e3a8a"
                />
               </div>
            </div>
          </div>
        </div>

        <!-- Media -->
        <div class="space-y-4">
          <div>
            <ImageUploader v-model="formData.image" label="封面圖片 (COVER IMAGE)" />
          </div>
          <div>
             <!-- Safely bind to images with v-if check to prevent initial null error if store is slow -->
            <label class="block text-xs text-gray-500 mb-1">畫廊多圖連結 (GALLERY IMAGES)</label>
            <GalleryUploader
              v-model="formData.images"
              label="畫廊多圖 - 支援批次上傳"
            />
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-xs text-gray-500 mb-1">專案簡述 (SUMMARY)</label>
          <textarea
            v-model="formData.description"
            class="w-full h-24 bg-black border border-gray-700 p-3 text-sm leading-relaxed focus:border-cyan-500 outline-none resize-none"
            placeholder="卡片上的簡短介紹..."
          ></textarea>
        </div>

        <!-- PM Specifics -->
        <div v-if="formData.type === 'PM'" class="space-y-6 border-t border-gray-800 pt-6">
           <h3 class="text-sm font-mono text-cyan-400">祕密道具詳情 (GADGET DETAILS)</h3>

           <!-- Metrics Row -->
           <div class="grid grid-cols-2 gap-4">
             <div>
              <label class="block text-xs text-gray-500 mb-1">關鍵數據：用戶數 (USERS)</label>
              <input v-model="formData.pm_metrics.users" class="w-full bg-black border border-gray-700 p-2 text-sm" placeholder="10k+" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">關鍵數據：成效 (GROWTH)</label>
              <input v-model="formData.pm_metrics.revenue" class="w-full bg-black border border-gray-700 p-2 text-sm" placeholder="+50%" />
            </div>
           </div>

           <!-- Problem & Solution -->
           <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-xs text-red-400 mb-1">故障/痛點 (PROBLEM)</label>
                <textarea
                  v-model="formData.pm_metrics._details.problem"
                  class="w-full h-20 bg-black border border-red-900/30 p-2 text-sm focus:border-red-500 outline-none"
                  placeholder="遇到的問題..."
                ></textarea>
              </div>
              <div>
                <label class="block text-xs text-green-400 mb-1">道具/解決方案 (SOLUTION)</label>
                 <textarea
                  v-model="formData.pm_metrics._details.solution"
                  class="w-full h-28 bg-black border border-green-900/30 p-2 text-sm focus:border-green-500 outline-none"
                  placeholder="使用了什麼道具/方法..."
                ></textarea>
              </div>
           </div>

           <!-- Tech & Impact -->
           <div class="space-y-4">
             <div>
               <label class="block text-xs text-blue-400 mb-1">核心機制 (TECH STACK) - 用逗號分隔</label>
               <input
                v-model="techStackInput"
                class="w-full bg-black border border-blue-900/30 p-2 text-sm focus:border-blue-500 outline-none"
                placeholder="Vue, Firebase, Tailwind"
              />
             </div>
             <div>
               <label class="block text-xs text-yellow-400 mb-1">任務成果 (IMPACT)</label>
               <textarea
                  v-model="formData.pm_metrics._details.impact"
                  class="w-full h-20 bg-black border border-yellow-900/30 p-2 text-sm focus:border-yellow-500 outline-none"
                  placeholder="量化成果描述..."
                ></textarea>
             </div>
             <div>
                <label class="block text-xs text-gray-500 mb-1">道具倉庫連結 (REPO LINK)</label>
                <input
                  v-model="formData.pm_metrics._details.repo"
                  class="w-full bg-black border border-gray-700 p-2 text-sm"
                  placeholder="https://github.com/..."
                />
             </div>
           </div>
        </div>

        <div v-if="formData.type === 'DESIGN'">
          <label class="block text-xs text-gray-500 mb-1">氛圍關鍵字 (MOOD)</label>
          <input
            v-model="formData.mood"
            class="w-full bg-black border border-gray-700 p-2 text-sm"
            placeholder="e.g. Cyberpunk"
          />
        </div>
      </div>

      <!-- RIGHT: Live Preview (Interactive & Scalable) -->
      <div class="bg-gray-900/40 border-l border-gray-800 relative flex flex-col overflow-hidden">
        <!-- Preview Header / Controls -->
        <div
          class="h-12 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900/80 backdrop-blur z-20"
        >
          <div class="text-[10px] font-mono text-cyan-500 tracking-widest flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            LIVE PREVIEW
          </div>
          <!-- Device Toggle (Mock) -->
          <div class="flex gap-2">
            <div
              class="w-8 h-8 rounded flex items-center justify-center bg-gray-800 text-gray-400 text-xs cursor-pointer hover:bg-gray-700 hover:text-white"
            >
              Desktop
            </div>
            <div
              class="w-8 h-8 rounded flex items-center justify-center bg-gray-800/50 text-gray-600 text-xs cursor-pointer"
            >
              Mobile
            </div>
          </div>
        </div>

        <!-- Preview Canvas (Centered & Scaled) -->
        <div
          class="flex-1 overflow-hidden relative flex items-center justify-center bg-[#050505] shadow-inner p-8"
        >
          <!-- Grid Background Pattern -->
          <div
            class="absolute inset-0 z-0 opacity-10 pointer-events-none"
            style="
              background-image:
                linear-gradient(#333 1px, transparent 1px),
                linear-gradient(90deg, #333 1px, transparent 1px);
              background-size: 40px 40px;
            "
          ></div>

          <!-- PM PREVIEW: Bento Card -->
          <div v-if="formData.type === 'PM'" class="relative z-10 transition-all duration-500 w-full flex flex-col items-center">
            <!-- Scale wrapper: Force scale down to simulate desktop view on smaller container -->
            <div class="origin-top transform scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-100">
               <div class="w-[350px] md:w-[400px]">
                <!-- Standard Bento size -->
                <BentoCard
                  :project="{
                    ...formData,
                    // Ensure preview sees the mapped structure immediately
                    details: formData.pm_metrics._details,
                    theme_color: formData.pm_metrics._theme_color
                  }"
                  size="large"
                  class="pointer-events-none shadow-2xl shadow-blue-900/20"
                />
              </div>
            </div>
            <div class="text-center mt-4 text-gray-600 font-mono text-xs">
              *Previewing 'Large' Variant
            </div>
          </div>

          <!-- DESIGN PREVIEW: Brick Wall Style Card -->
          <div v-if="formData.type === 'DESIGN'" class="relative z-10">
            <div
              class="group relative w-[400px] aspect-video rounded-lg overflow-hidden cursor-pointer"
            >
              <!-- RGB Border (Animated) -->
              <div
                class="absolute -inset-[2px] rounded-lg bg-gradient-to-r from-red-500 via-green-500 to-blue-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"
              ></div>

              <!-- Main Image Container -->
              <div
                class="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden border border-white/10 group-hover:scale-[1.02] transition-transform duration-500"
              >
                <!-- Image -->
                <img
                  :src="
                    formData.image || 'https://placehold.co/600x400/000000/333333?text=NO+IMAGE'
                  "
                  class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                  :class="!formData.image ? 'grayscale opacity-50' : ''"
                />

                <!-- Text Overlay -->
                <div
                  class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/50 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                >
                  <div class="text-[10px] text-purple-400 font-mono mb-1 tracking-widest uppercase">
                    {{ formData.category || 'CATEGORY' }}
                  </div>
                  <h3 class="text-xl font-bold text-white leading-tight">
                    {{ formData.title || 'Project Title' }}
                  </h3>
                </div>
              </div>
            </div>
            <div class="text-center mt-8 text-gray-600 font-mono text-xs">
              *Design Wall Card Style
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #333;
}
</style>
