<script setup>
import { computed, onMounted } from 'vue'
import StoryBook from '@/components/Profile/StoryBook.vue'
import BookPage from '@/components/Profile/BookPage.vue'
import { useDataStore } from '@/stores/dataStore'

const store = useDataStore()

// Fetch data on mount
onMounted(() => {
  store.fetchProfile()
})

const profile = computed(() => store.getProfile())
const skills = computed(() => profile.value?.skills || [])
const experience = computed(() => profile.value?.experience || [])

// Helper for skill colors - cycling through 4 colors
const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500']
</script>

<template>
  <div class="relative w-full h-screen bg-[#111] overflow-hidden flex items-center justify-center">
    <!-- Background Decor -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,#222_0%,#000_100%)]"></div>

    <StoryBook :totalPages="4" v-slot="{ currentPage, next, prev }">
      <!-- Page 1: Cover -->
      <BookPage :index="0" :currentPage="currentPage" @click="next">
        <template #front>
          <div
            class="h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-r-xl border-l-4 border-yellow-400"
          >
            <h1 class="text-6xl font-black tracking-tighter mb-4 text-center">THE<br />PROFILE</h1>
            <div
              class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-8 shadow-lg"
            >
              <span class="text-3xl">🔔</span>
            </div>
            <p class="font-mono text-sm tracking-widest opacity-80">CLICK TO OPEN</p>
          </div>
        </template>
        <template #back>
          <!-- Inside Cover (Left) - Photo Area -->
          <div class="h-full flex flex-col justify-center items-center text-center p-4">
            <div
              class="w-full h-2/3 bg-gray-200 rounded-lg overflow-hidden mb-6 shadow-inner relative group cursor-pointer"
            >
              <img
                :src="profile.image"
                class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>

            <h2 class="text-2xl font-bold mb-1 text-gray-400">Chapter 01</h2>
            <h3 class="text-3xl font-black text-gray-800">{{ profile.name }}</h3>
            <p class="mt-2 text-gray-600 max-w-xs text-sm font-mono">{{ profile.title }}</p>
          </div>
        </template>
      </BookPage>

      <!-- Page 2: About & Skills -->
      <BookPage :index="1" :currentPage="currentPage" @click="currentPage > 1 ? prev() : next()">
        <template #front>
          <div class="h-full p-6 flex flex-col">
            <h3
              class="text-3xl font-bold mb-4 text-gray-800 border-b-2 border-blue-500 pb-2 inline-block"
            >
              About Me
            </h3>
            <p
              class="text-gray-600 leading-relaxed mb-6 text-sm flex-1 overflow-y-auto custom-scrollbar"
            >
              {{ profile.bio }}
            </p>

            <h4 class="text-xl font-bold mb-4 text-gray-700">Gadget Collection (Skills)</h4>
            <div class="space-y-3">
              <div v-for="(skill, index) in skills" :key="skill.name">
                <div class="flex justify-between text-xs mb-1 font-mono font-bold text-gray-500">
                  <span>{{ skill.name }}</span>
                  <span>{{ skill.level }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-1000"
                    :class="colors[index % 4]"
                    :style="{ width: currentPage >= 1 ? skill.level + '%' : '0%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #back>
          <div
            class="h-full flex flex-col justify-center items-center text-center bg-gray-100 relative overflow-hidden"
          >
            <!-- Decor -->
            <div
              class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"
            ></div>
            <h2 class="text-4xl font-black text-gray-400">THE<br />JOURNEY</h2>
            <p class="font-mono text-xs tracking-widest text-gray-500 mt-2">NEXT CHAPTER</p>
          </div>
        </template>
      </BookPage>

      <!-- Page 3: Experience (New) -->
      <BookPage :index="2" :currentPage="currentPage" @click="currentPage > 2 ? prev() : next()">
        <template #front>
          <div class="h-full p-6 bg-white relative">
            <h3
              class="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-500 pb-2 inline-block"
            >
              Legendary Path
            </h3>

            <div class="space-y-6 relative ml-2 h-[80%] overflow-y-auto custom-scrollbar pl-2">
              <!-- Timeline Line -->
              <div class="absolute left-0 top-2 bottom-0 w-0.5 bg-gray-200"></div>

              <div v-for="exp in experience" :key="exp.id" class="relative pl-6">
                <!-- Dot -->
                <div
                  class="absolute left-[-4px] top-1.5 w-2.5 h-2.5 bg-yellow-400 rounded-full border border-white shadow-sm z-10"
                ></div>

                <div class="text-xs font-mono text-gray-400 mb-0.5">{{ exp.period }}</div>
                <h4 class="text-sm font-bold text-gray-800">{{ exp.company }}</h4>
                <div class="text-xs text-blue-600 font-bold mb-1">{{ exp.role }}</div>
                <p class="text-xs text-gray-500 leading-snug">{{ exp.description }}</p>
              </div>
            </div>
          </div>
        </template>
        <template #back>
          <div class="h-full flex flex-col justify-center items-center text-center bg-gray-100">
            <div class="w-20 h-20 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
            <p class="font-mono text-xs text-gray-400">LOADING NEXT...</p>
          </div>
        </template>
      </BookPage>

      <!-- Page 4: Contact & Back Cover -->
      <BookPage :index="3" :currentPage="currentPage" @click="prev">
        <template #front>
          <div class="h-full flex flex-col justify-center items-center p-6">
            <h3 class="text-3xl font-bold mb-8">Get In Touch</h3>

            <div class="space-y-4 w-full max-w-xs">
              <a
                :href="'mailto:' + profile.email"
                class="block w-full py-4 bg-gray-900 text-white text-center rounded-lg font-mono hover:bg-black transition-colors text-sm"
              >
                {{ profile.email }}
              </a>
              <button
                class="block w-full py-4 bg-blue-600 text-white text-center rounded-lg font-mono hover:bg-blue-700 transition-colors text-sm"
              >
                LINKEDIN
              </button>
            </div>

            <div class="mt-12 text-center">
              <p class="text-xs text-gray-500 max-w-[200px]">
                "If you have a problem that cannot be solved, just call me."
              </p>
            </div>
          </div>
        </template>
        <template #back>
          <div
            class="h-full flex flex-col items-center justify-center bg-blue-900 text-white rounded-l-xl"
          >
            <div class="text-sm font-mono opacity-50 mb-2">DORAEMON PORTFOLIO</div>
            <div class="text-2xl font-bold">THE END</div>
            <p class="text-xs mt-4 opacity-30">© 2026 Logic & Magic.</p>
          </div>
        </template>
      </BookPage>
    </StoryBook>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}
</style>
