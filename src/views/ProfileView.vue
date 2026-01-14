<script setup>
import { ref } from 'vue'
import StoryBook from '@/components/Profile/StoryBook.vue'
import BookPage from '@/components/Profile/BookPage.vue'

// Data can be moved to json later
const skills = [
  { name: 'Product Strategy', value: 90, color: 'bg-blue-500' },
  { name: 'UI/UX Design', value: 85, color: 'bg-purple-500' },
  { name: 'Vue.js / Frontend', value: 80, color: 'bg-green-500' },
  { name: 'Team Leadership', value: 88, color: 'bg-red-500' },
]
</script>

<template>
  <div class="relative w-full h-screen bg-[#111] overflow-hidden flex items-center justify-center">
    <!-- Background Decor -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,#222_0%,#000_100%)]"></div>

    <StoryBook :totalPages="3" v-slot="{ currentPage, next, prev }">
      
      <!-- Page 1: Cover -->
      <BookPage :index="0" :currentPage="currentPage" @click="next">
        <template #front>
          <div class="h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-r-xl border-l-4 border-yellow-400">
            <h1 class="text-6xl font-black tracking-tighter mb-4 text-center">THE<br>PROFILE</h1>
            <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-8 shadow-lg">
              <span class="text-3xl">🔔</span>
            </div>
            <p class="font-mono text-sm tracking-widest opacity-80">CLICK TO OPEN</p>
          </div>
        </template>
        <template #back>
          <!-- Inside Cover (Left) - Photo Area -->
          <div class="h-full flex flex-col justify-center items-center text-center p-4">
            <div class="w-full h-2/3 bg-gray-200 rounded-lg overflow-hidden mb-6 shadow-inner relative group cursor-pointer">
               <!-- Placeholder for editable image -->
               <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
               
               <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                 <span class="text-white font-mono text-xs border border-white px-2 py-1">CHANGE PHOTO</span>
               </div>
            </div>
            
            <h2 class="text-2xl font-bold mb-1 text-gray-400">Chapter 01</h2>
            <h3 class="text-4xl font-black text-gray-800">The Origin</h3>
            <p class="mt-4 text-gray-600 max-w-xs text-sm">Where logic creates magic.</p>
          </div>
        </template>
      </BookPage>

      <!-- Page 2: About & Skills -->
      <BookPage :index="1" :currentPage="currentPage" @click="currentPage > 1 ? prev() : next()">
        <template #front>
          <div class="h-full p-4">
            <h3 class="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-blue-500 pb-2 inline-block">About Me</h3>
            <p class="text-gray-600 leading-relaxed mb-8">
              I am a Product Manager who codes, or perhaps a Designer who thinks in algorithms. 
              My pocket is filled with tools to solve impossible problems.
            </p>
            
            <h4 class="text-xl font-bold mb-4 text-gray-700">Gadget Collection (Skills)</h4>
            <div class="space-y-4">
              <div v-for="skill in skills" :key="skill.name">
                <div class="flex justify-between text-sm mb-1 font-mono font-bold text-gray-500">
                  <span>{{ skill.name }}</span>
                  <span>{{ skill.value }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="h-2 rounded-full transition-all duration-1000" :class="skill.color" :style="{ width: currentPage >= 1 ? skill.value + '%' : '0%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #back>
          <div class="h-full flex flex-col justify-center items-center text-center bg-gray-100">
            <div class="w-full h-full flex items-center justify-center">
               <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1974&auto=format&fit=crop" class="w-full h-full object-cover mix-blend-multiply opacity-50" />
               <h2 class="absolute text-5xl font-black text-gray-900/10 rotate-[-10deg]">KEEP<br>EXPLORING</h2>
            </div>
          </div>
        </template>
      </BookPage>

      <!-- Page 3: Contact & Back Cover -->
      <BookPage :index="2" :currentPage="currentPage" @click="prev">
        <template #front>
           <div class="h-full flex flex-col justify-center items-center">
            <h3 class="text-3xl font-bold mb-8">Get In Touch</h3>
            
            <div class="space-y-6 w-full max-w-xs">
              <a href="#" class="block w-full py-4 bg-gray-900 text-white text-center rounded-lg font-mono hover:bg-black transition-colors">
                EMAIL ME
              </a>
              <a href="#" class="block w-full py-4 bg-blue-600 text-white text-center rounded-lg font-mono hover:bg-blue-700 transition-colors">
                LINKEDIN
              </a>
              <a href="#" class="block w-full py-4 bg-transparent border-2 border-gray-900 text-gray-900 text-center rounded-lg font-mono hover:bg-gray-100 transition-colors">
                GITHUB
              </a>
            </div>
          </div>
        </template>
        <template #back>
           <div class="h-full flex flex-col items-center justify-center bg-blue-900 text-white rounded-l-xl">
             <div class="text-sm font-mono opacity-50 mb-2">DORAEMON PORTFOLIO</div>
             <div class="text-2xl font-bold">THE END</div>
             <p class="text-xs mt-4 opacity-30">© 2026 Logic & Magic.</p>
           </div>
        </template>
      </BookPage>

    </StoryBook>
  </div>
</template>
