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

  // 1. Seed PM Projects
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

    log(`Checking PM: ${project.title}...`)

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

  // 2. Seed Design Projects (Dummy Data)
  const designDummies = [
    { title: 'Neon Genesis', category: '3D Art', layout: 'big', color: '#fca5a5' },
    { title: 'Cyber Void', category: 'Motion', layout: 'standard', color: '#86efac' },
    { title: 'Quantum UI', category: 'Interface', layout: 'wide', color: '#93c5fd' },
    { title: 'Flux Capacitor', category: 'Concept', layout: 'tall', color: '#f0abfc' },
    { title: 'Neural Net', category: 'AI Generated', layout: 'standard', color: '#fcd34d' },
    { title: 'Holo Prism', category: '3D Art', layout: 'wide', color: '#6ee7b7' },
    { title: 'Void Walker', category: 'Character', layout: 'tall', color: '#c4b5fd' },
    { title: 'Time Dilator', category: 'VFX', layout: 'standard', color: '#f472b6' },
    { title: 'Hyper Drive', category: 'Motion', layout: 'big', color: '#2dd4bf' },
    { title: 'Chrono Trigger', category: 'Concept', layout: 'wide', color: '#fb923c' },
    { title: 'Event Horizon', category: '3D Art', layout: 'standard', color: '#e879f9' },
    { title: 'Singularity', category: 'Interface', layout: 'tall', color: '#38bdf8' },
  ]

  log('--- Seeding Design Dummies ---')

  for (const dummy of designDummies) {
     const dbPayload = {
      title: dummy.title,
      category: dummy.category,
      type: 'DESIGN',
      description: 'A futuristic design exploration. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      // Use placeholder images (abstract neon)
      image: `https://picsum.photos/seed/${dummy.title.replace(' ', '')}/800/800`,
      tags: ['Futuristic', 'Design', 'Concept'],
      layout: dummy.layout,
      theme_color: dummy.color
    }

    log(`Inserting Design: ${dummy.title}...`)

    // Check exist
    const { data: existing } = await supabase.from('projects').select('id').eq('title', dummy.title).single()
    if (!existing) {
        const { error } = await supabase.from('projects').insert(dbPayload)
        if (error) log(`Error: ${error.message}`)
        else log(`Created ${dummy.title}`)
    } else {
        // Update layout/color just in case we changed seed logic
        await supabase.from('projects').update(dbPayload).eq('id', existing.id)
        log(`Updated ${dummy.title}`)
    }
  }

  // 3. Seed Profile (Hero Journey)
  log('--- Seeding Profile Hero Data ---')
  const heroExperience = [
      {
        id: 101, // Arbitrary ID
        company: 'The New Horizon',
        role: 'Future Creator',
        period: '2026 - Present',
        description: 'Now seeking to equip human teams with advanced AI weaponry. Ready to deploy into high-intensity development environments and turn imagination into reality.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        theme: 'purple',
        techStack: ['AGI', 'Quantum', 'Neural Link'],
        achievements: ['Architected Sentient Assistant', '99% Global Opt', 'Thought Interface'],
        bullets: ['Seeking Senior/Lead Roles', 'Specialty: AI & Human-Computer Interaction', 'Ready for Immediate Deployment']
      },
      {
        id: 102,
        company: 'Matsushiba Lab',
        role: 'Gadget Architect',
        period: '2023 - 2026',
        description: 'Specialized in 4th-dimensional state management. Built the "Anywhere Door" routing system which reduced user travel time to zero. Led a team of mini-dora robots to optimize production.',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
        theme: 'orange',
        techStack: ['Vue 4', 'Hyper-Loop', 'Mini-Dora'],
        achievements: ['1B+ Users', '200% Efficiency', 'Mentored 50 Bots'],
        bullets: ['Senior Frontend Developer at Matsushiba', 'Led team of 10+ Engineers', 'Optimized Production by 200%']
      },
      {
        id: 103,
        company: 'Robot Factory',
        role: 'Prototype Model Ø',
        period: '2112 (Origin)',
        description: 'Manufactured with a passion for clean code and problem-solving algorithms. Passed all quality assurance tests with S-Rank. Initialized: Perfect.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        theme: 'blue',
        techStack: ['Assembly', 'Logic Circuits', 'Fusion Reactor'],
        achievements: ['S-Rank QA', '0.001ms Kernel', 'Doraemon Pattern'],
        bullets: ['Graduated S-Rank from Robot Academy', 'Core Focus: Algorithms & System Design', 'Clean Code Advocate']
      }
  ]

  // Note: Backend schema for 'experience' is JSONB, so adding underscore fields is safe for naive storage.
  // Ideally, update ProfileEditor to support editing these, but for Seeding it's enough.

  // Assuming we update the main profile (id=1 or first found)
  try {
      const { data: profile } = await supabase.from('profile').select('id').limit(1).single()
      if (profile) {
          const { error } = await supabase.from('profile').update({
              experience: heroExperience,
              image: 'https://i.pinimg.com/736x/2f/55/97/2f559707c3b01a1964c37f88f288d6ef.jpg', // Doraemon avatar
              bio: 'A highly advanced cat-type robot from the 22nd century. Specialized in problem-solving gadgets and dream realization. Currently deployed to assist User with full-stack development.'
          }).eq('id', profile.id)

          if (error) log(`Error updating profile: ${error.message}`)
          else log('Successfully seeded Profile Hero Data!')
      } else {
          log('No existing profile found to update. (Create a row in Supabase first)')
      }
  } catch (err) {
      log(`Profile Seed Error: ${err.message}`)
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
