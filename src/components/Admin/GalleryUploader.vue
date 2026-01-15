<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase'
import { Upload, Loader2, X, Image as ImageIcon, Plus } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  label: String,
})

const emit = defineEmits(['update:modelValue'])

const isUploading = ref(false)
const fileInput = ref(null)

async function uploadImages(event) {
  const files = event.target.files
  if (!files || files.length === 0) return

  isUploading.value = true
  const newUrls = []

  try {
    for (const file of files) {
      // 1. Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      // 2. Upload
      const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file)

      if (uploadError) throw uploadError

      // 3. Get URL
      const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath)
      newUrls.push(data.publicUrl)
    }

    // 4. Update parent (Append new images)
    emit('update:modelValue', [...props.modelValue, ...newUrls])
  } catch (error) {
    console.error(error)
    alert('Upload failed: ' + error.message)
  } finally {
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function removeImage(index) {
  const newArray = [...props.modelValue]
  newArray.splice(index, 1)
  emit('update:modelValue', newArray)
}
</script>

<template>
  <div class="space-y-3">
    <label v-if="label" class="block text-xs font-mono text-cyan-500 flex items-center gap-2">
      <ImageIcon class="w-3 h-3" />
      {{ label }}
    </label>

    <!-- Grid Layout -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Existing Images -->
      <div
        v-for="(url, index) in modelValue"
        :key="index"
        class="group relative aspect-video bg-gray-900 border border-gray-800 rounded overflow-hidden"
      >
        <img :src="url" class="w-full h-full object-cover" />

        <!-- Hover Overlay -->
        <div
          class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
        >
          <button
            @click="removeImage(index)"
            class="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-transform hover:scale-110"
            title="Remove"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Index Badge -->
        <div
          class="absolute top-1 left-1 px-1.5 py-0.5 bg-black/70 text-[10px] text-gray-400 font-mono"
        >
          {{ index + 1 }}
        </div>
      </div>

      <!-- Upload Button (Drop Zone) -->
      <div
        class="relative aspect-video bg-gray-900/30 border border-dashed border-gray-700 hover:border-cyan-500/50 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-cyan-900/10 group"
        @click="fileInput.click()"
      >
        <div v-if="isUploading" class="flex flex-col items-center text-cyan-400">
          <Loader2 class="w-6 h-6 animate-spin mb-2" />
          <span class="text-[10px] font-mono tracking-widest">Processing...</span>
        </div>
        <div
          v-else
          class="flex flex-col items-center text-gray-500 group-hover:text-cyan-400 transition-colors"
        >
          <Plus class="w-8 h-8 mb-2 opacity-50 group-hover:opacity-100" />
          <span class="text-[10px] font-mono tracking-widest text-center px-2">ADD IMAGES</span>
        </div>

        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="uploadImages"
        />
      </div>
    </div>

    <!-- URL Debug/Fallback (Optional: Can be hidden or put in a collapsible if user really wants to see URLs) -->
    <!-- Commented out to reduce visual clutter as requested -->
    <!--
    <div class="text-[10px] text-gray-700 font-mono break-all mt-2">
      Total: {{ modelValue.length }} images
    </div>
    -->
  </div>
</template>
