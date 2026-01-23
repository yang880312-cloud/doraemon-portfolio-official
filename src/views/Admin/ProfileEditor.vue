<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/dataStore'
import ImageUploader from '@/components/Admin/ImageUploader.vue'

const router = useRouter()
const store = useDataStore()

const formData = ref({
  name: '',
  title: '',
  bio: '',
  skills: [],
  experience: [],
  email: '',
  image: '',
})

onMounted(async () => {
  await store.fetchProfile()
  const current = store.getProfile()
  if (current) {
    formData.value = JSON.parse(JSON.stringify(current))
  }
  // Ensure default structure
  if (!formData.value.skills) formData.value.skills = []
  if (!formData.value.experience) formData.value.experience = []

  // Convert Arrays to Strings for Editing
  formData.value.experience.forEach(exp => {
      exp.techStackStr = Array.isArray(exp.techStack) ? exp.techStack.join('\n') : (exp.techStack || '')
      exp.bulletsStr = Array.isArray(exp.bullets) ? exp.bullets.join('\n') : (exp.bullets || '')
      exp.achievementsStr = Array.isArray(exp.achievements) ? exp.achievements.join('\n') : (exp.achievements || '')
  })
})

function addSkill() {
  formData.value.skills.push({ name: 'New Skill', level: 50 })
}

function removeSkill(index) {
  formData.value.skills.splice(index, 1)
}

function addExperience() {
  formData.value.experience.push({
    id: Date.now(),
    company: 'New Company',
    role: 'Position Title',
    period: '2024 - Present',
    description: 'Brief description of the role...',
    theme: 'cyan',
    techStack: ['Tech 1', 'Tech 2'],
    bullets: ['Key impact 1', 'Key impact 2'],
    achievements: ['Achievement 1', 'Achievement 2'],
     // Init strings
    techStackStr: 'Tech 1\nTech 2',
    bulletsStr: 'Key impact 1\nKey impact 2',
    achievementsStr: 'Achievement 1\nAchievement 2',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
  })
}

function removeExperience(index) {
  formData.value.experience.splice(index, 1)
}

async function save() {
  // Convert Strings back to Arrays
  const payload = JSON.parse(JSON.stringify(formData.value))
  payload.experience.forEach(exp => {
      exp.techStack = exp.techStackStr.split('\n').filter(s => s.trim())
      exp.bullets = exp.bulletsStr.split('\n').filter(s => s.trim())
      exp.achievements = exp.achievementsStr.split('\n').filter(s => s.trim())

      // cleanup temporary fields
      delete exp.techStackStr
      delete exp.bulletsStr
      delete exp.achievementsStr
  })

  await store.updateProfile(payload)
  router.push('/admin')
}
</script>

<template>
  <div
    class="w-full h-full overflow-y-auto custom-scrollbar bg-[#050505] text-white p-8 font-sans pb-32"
  >
    <header
      class="flex justify-between items-center mb-8 border-b border-gray-800 pb-4 sticky top-0 bg-[#050505] z-10 pt-2"
    >
      <div>
        <h1 class="text-2xl font-bold font-mono text-cyan-400">編輯個人履歷 (PROFILE)</h1>
      </div>
      <div class="flex gap-4">
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

    <div class="max-w-3xl mx-auto space-y-8">
      <!-- Basics -->
      <div class="grid grid-cols-2 gap-8">
        <div>
          <label class="block text-xs text-gray-500 mb-1">大頭貼連結 (AVATAR URL)</label>
          <input
            v-model="formData.image"
            class="w-full bg-black border border-gray-700 p-2 text-xs font-mono text-gray-400 focus:border-cyan-500 outline-none mb-2"
          />
          <div class="w-24 h-24 rounded-full overflow-hidden border border-gray-700">
            <img :src="formData.image" class="w-full h-full object-cover" />
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-xs text-gray-500 mb-1">姓名 (NAME)</label>
            <input
              v-model="formData.name"
              class="w-full bg-black border border-gray-700 p-2 focus:border-cyan-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">職稱 (TITLE)</label>
            <input
              v-model="formData.title"
              class="w-full bg-black border border-gray-700 p-2 focus:border-cyan-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Email</label>
            <input
              v-model="formData.email"
              class="w-full bg-black border border-gray-700 p-2 focus:border-cyan-500 outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Bio -->
      <div>
        <label class="block text-xs text-gray-500 mb-1">自我介紹 (BIO)</label>
        <textarea
          v-model="formData.bio"
          class="w-full h-32 bg-black border border-gray-700 p-3 text-sm leading-relaxed focus:border-cyan-500 outline-none"
        ></textarea>
      </div>

      <!-- Experience -->
      <div>
        <div class="flex justify-between items-end mb-4">
          <label class="text-xs text-cyan-500 font-mono">經歷里程碑 (EXPERIENCE TIMELINE)</label>
          <button
            @click="addExperience"
            class="text-xs text-yellow-500 border border-yellow-900 px-2 py-1 hover:bg-yellow-900/20"
          >
            + 新增經歷
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="(exp, index) in formData.experience"
            :key="index"
            class="bg-gray-900/30 p-4 border border-gray-800 relative group hover:border-yellow-500/30 transition-colors"
          >
            <button
              @click="removeExperience(index)"
              class="absolute top-2 right-2 text-red-500 hover:text-red-400 text-xs opacity-50 group-hover:opacity-100"
            >
              刪除
            </button>

            <!-- Row 1: Basic Info -->
            <div class="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label class="block text-[10px] text-gray-600 mb-1">公司/組織 (COMPANY)</label>
                <input
                  v-model="exp.company"
                  class="w-full bg-black border border-gray-700 p-2 text-sm focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label class="block text-[10px] text-gray-600 mb-1">擔任職位 (ROLE)</label>
                <input
                  v-model="exp.role"
                  class="w-full bg-black border border-gray-700 p-2 text-sm focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            <!-- Row 2: Period & Theme -->
            <div class="grid grid-cols-2 gap-4 mb-2">
               <div>
                  <label class="block text-[10px] text-gray-600 mb-1">時間區間 (PERIOD)</label>
                  <input
                    v-model="exp.period"
                    class="w-full bg-black border border-gray-700 p-2 text-sm focus:border-cyan-500 outline-none"
                  />
               </div>
               <div>
                  <label class="block text-[10px] text-gray-600 mb-1">視覺主題 (THEME COLOR)</label>
                  <select v-model="exp.theme" class="w-full bg-black border border-gray-700 p-2 text-sm focus:border-cyan-500 outline-none text-gray-300">
                      <option value="cyan">Cyan (Default)</option>
                      <option value="purple">Purple (Future)</option>
                      <option value="orange">Orange (Industrial)</option>
                      <option value="blue">Blue (Origin)</option>
                  </select>
               </div>
            </div>

            <!-- Row 3: Narrative -->
            <div class="mb-4">
              <label class="block text-[10px] text-gray-600 mb-1">任務簡報 (MISSION BRIEF)</label>
              <textarea
                v-model="exp.description"
                class="w-full h-16 bg-black border border-gray-700 p-2 text-sm focus:border-cyan-500 outline-none resize-none"
              ></textarea>
            </div>

            <!-- Row 4: Advanced Lists (v2.0) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 border-t border-gray-800 pt-4">
                <!-- Tech Stack -->
                <div>
                     <label class="block text-[10px] text-blue-400 mb-1">技術堆疊 (TECH STACK)</label>
                     <div class="text-[9px] text-gray-600 mb-1">每行一項</div>
                     <textarea
                        v-model="exp.techStackStr"
                        class="w-full h-24 bg-black border border-gray-700 p-2 text-xs focus:border-blue-500 outline-none resize-none font-mono"
                        placeholder="Vue.js&#10;Node.js"
                     ></textarea>
                </div>

                <!-- Key Impacts (Bullets) -->
                <div>
                     <label class="block text-[10px] text-green-400 mb-1">關鍵戰績 (KEY IMPACTS)</label>
                     <div class="text-[9px] text-gray-600 mb-1">每行一項 (顯示為 Bullet Points)</div>
                     <textarea
                        v-model="exp.bulletsStr"
                        class="w-full h-24 bg-black border border-gray-700 p-2 text-xs focus:border-green-500 outline-none resize-none font-mono"
                        placeholder="Lead Team of 10&#10;Increased Revenue by 20%"
                     ></textarea>
                </div>

                <!-- Achievements -->
                <div>
                     <label class="block text-[10px] text-yellow-400 mb-1">主要成就 (ACHIEVEMENTS)</label>
                     <div class="text-[9px] text-gray-600 mb-1">每行一項 (底部 Grid)</div>
                     <textarea
                        v-model="exp.achievementsStr"
                        class="w-full h-24 bg-black border border-gray-700 p-2 text-xs focus:border-yellow-500 outline-none resize-none font-mono"
                        placeholder="S-Rank Award&#10;0.001ms Latency"
                     ></textarea>
                </div>
            </div>

            <!-- Row 5: Image -->
            <div class="mt-2">
              <label class="block text-[10px] text-gray-600 mb-1">背景影像 (IMAGE URL)</label>
              <input
                v-model="exp.image"
                class="w-full bg-black border border-gray-700 p-2 text-sm focus:border-cyan-500 outline-none mb-2"
                placeholder="https://..."
              />
              <div
                v-if="exp.image"
                class="w-full h-24 bg-gray-800 rounded overflow-hidden"
              >
                <img :src="exp.image" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills -->
      <div>
        <div class="flex justify-between items-end mb-2">
          <label class="text-xs text-cyan-500 font-mono">技能樹 (SKILLS)</label>
          <button
            @click="addSkill"
            class="text-xs text-green-500 border border-green-900 px-2 py-1 hover:bg-green-900/20"
          >
            + 新增技能
          </button>
        </div>

        <div class="space-y-2">
          <div
            v-for="(skill, index) in formData.skills"
            :key="index"
            class="flex gap-4 items-center bg-gray-900/30 p-2 border border-gray-800"
          >
            <input
              v-model="skill.name"
              class="bg-transparent border-b border-gray-700 w-32 focus:border-cyan-500 outline-none text-sm"
              placeholder="技能名稱"
            />
            <input
              type="range"
              v-model.number="skill.level"
              min="0"
              max="100"
              class="flex-1 accent-cyan-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span class="text-xs font-mono w-8 text-right">{{ skill.level }}%</span>
            <button @click="removeSkill(index)" class="text-red-500 hover:text-red-400">×</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
