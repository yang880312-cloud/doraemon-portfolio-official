<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase'
import { Upload, Loader2, Image as ImageIcon, X, Edit2 } from 'lucide-vue-next'

const props = defineProps(['modelValue', 'label'])
const emit = defineEmits(['update:modelValue'])

const isUploading = ref(false)
const fileInput = ref(null)

async function uploadImage(event) {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath)
    emit('update:modelValue', data.publicUrl)
  } catch (error) {
    console.error(error)
    alert('Upload failed: ' + error.message)
  } finally {
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function removeImage() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="group">
    <label class="block text-xs font-mono text-cyan-500 mb-2 flex items-center gap-2">
      <ImageIcon class="w-3 h-3" />
      {{ label || 'IMAGE ASSET' }}
    </label>

    <!-- 1. Has Image State -->
    <div
      v-if="modelValue"
      class="relative w-full aspect-video bg-gray-900 border border-gray-700 overflow-hidden group/image"
    >
      <img :src="modelValue" class="w-full h-full object-cover" />

      <!-- Overlay Controls -->
      <div
        class="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-4"
      >
        <button
          @click="fileInput.click()"
          class="flex flex-col items-center text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <div class="p-2 bg-cyan-900/50 rounded-full mb-1"><Edit2 class="w-4 h-4" /></div>
          <span class="text-[10px] font-mono">CHANGE</span>
        </button>
        <button
          @click="removeImage"
          class="flex flex-col items-center text-red-500 hover:text-red-400 transition-colors"
        >
          <div class="p-2 bg-red-900/30 rounded-full mb-1"><X class="w-4 h-4" /></div>
          <span class="text-[10px] font-mono">REMOVE</span>
        </button>
      </div>
    </div>

    <!-- 2. Empty State -->
    <div
      v-else
      class="relative w-full aspect-[3/1] bg-gray-900/30 border border-dashed border-gray-700 hover:border-cyan-500/50 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-cyan-900/10"
      :class="isUploading ? 'opacity-50 pointer-events-none' : ''"
      @click="fileInput.click()"
    >
      <div v-if="isUploading" class="flex flex-col items-center text-cyan-400">
        <Loader2 class="w-5 h-5 animate-spin mb-2" />
        <span class="text-[10px] font-mono tracking-widest">UPLOADING...</span>
      </div>
      <div
        v-else
        class="flex flex-col items-center text-gray-500 group-hover:text-cyan-400 transition-colors"
      >
        <Upload class="w-5 h-5 mb-1" />
        <span class="text-[10px] font-mono tracking-widest">DRAG OR CLICK TO UPLOAD</span>
      </div>
    </div>

    <!-- Hidden Input -->
    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="uploadImage" />
  </div>
</template>
