<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase'
import portfolioData from '@/data/portfolio.json'

const status = ref('Ready to seed')
const logs = ref([])

function log(msg) {
  logs.value.push(msg)
}

async function seedData() {
  status.value = 'Seeding...'
  log('Starting seed process...')

  for (const project of portfolioData) {
    // Prepare object for DB
    const dbPayload = {
      // id: project.id, // Let DB auto-generate ID to avoid conflicts
      title: project.title,
      category: project.category,
      type: 'PM', // Explicitly mark as PM
      description: project.description,
      image: project.thumbnail,
      tags: project.tags,
      pm_metrics: {
        ...project.pm_metrics,
        _details: project.details,
        _theme_color: project.theme_color
      }
    }

    log(`Inserting: ${project.title}...`)

    try {
        // First check if it exists by title to avoid duplicates (naive check)
        const { data: existing } = await supabase.from('projects').select('id').eq('title', project.title).single()

        if (existing) {
            log(`Skipping ${project.title} (Already exists)`)
            // Optional: Update it?
            const { error: updateErr } = await supabase.from('projects').update(dbPayload).eq('id', existing.id)
            if (updateErr) log(`Error updating: ${updateErr.message}`)
            else log(`Updated ${project.title}`)
        } else {
            const { error } = await supabase.from('projects').insert(dbPayload)
            if (error) {
                log(`Failed to insert ${project.title}: ${error.message}`)
            } else {
                log(`Success: ${project.title}`)
            }
        }
    } catch (e) {
        log(`Exception: ${e.message}`)
    }
  }

  status.value = 'Finished'
  log('Done.')
}
</script>

<template>
  <div class="p-8 text-white bg-gray-900 min-h-screen">
    <h1 class="text-2xl mb-4">Database Seeder</h1>
    <button @click="seedData" class="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
      Start Seeding
    </button>
    <div class="mt-4 p-4 bg-black rounded font-mono text-sm h-96 overflow-auto">
      <div v-for="(l, i) in logs" :key="i">{{ l }}</div>
    </div>
    <div class="mt-4 text-xl">{{ status }}</div>
  </div>
</template>
