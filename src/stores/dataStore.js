import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useDataStore = defineStore('data', () => {
  const projects = ref([])
  const profile = ref({
    name: 'Loading...',
    title: '...',
    bio: '',
    skills: [],
    experience: [],
    image: '',
    email: '',
  })

  const isLoading = ref(false)
  const lastFetch = ref(0) // Simple cache timestamp

  // --- Projects ---

  async function fetchProjects(force = false) {
    // Basic cache implementation: Don't refetch if less than 1 min has passed, unless forced
    if (!force && projects.value.length > 0 && Date.now() - lastFetch.value < 60000) return

    isLoading.value = true
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Fallback Mock Data if DB is empty (Ensure 5 cards exist for Design Demo)
      if (!data || data.length === 0 || !data.some(p => p.type === 'DESIGN')) {
        console.warn('No projects found, using Mock Data')
        const mockProjects = [
          { id: 101, title: 'NEON GENESIS', type: 'DESIGN', category: 'Visual', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', description: 'Cyberpunk aesthetic exploration.' },
          { id: 102, title: 'VOID WALKER', type: 'DESIGN', category: 'UI/UX', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475', description: 'Zero-G interface design.' },
          { id: 103, title: 'CHROMA TYPE', type: 'DESIGN', category: 'Visual', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f', description: 'Typography in motion.' },
          { id: 104, title: 'FLUID STATE', type: 'DESIGN', category: 'Experiments', image: 'https://images.unsplash.com/photo-1506259091721-347f798196d4', description: 'Liquid simulations.' },
          { id: 105, title: 'ASTRAL PROJECTION', type: 'DESIGN', category: 'Visual', image: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2', description: '3D rendering showcase.' }
        ]
        projects.value = mockProjects
      } else {
        projects.value = data
      }

      lastFetch.value = Date.now()
    } catch (err) {
      console.error('Error fetching projects:', err)
      // On error, also use mock?
    } finally {
      isLoading.value = false
    }
  }

  async function addProject(project) {
    const { id, ...newProject } = project // Remove ID if it's null (DB auto-generates)
    const { data, error } = await supabase.from('projects').insert(newProject).select()
    if (error) {
      console.error('Error adding project:', error)
      alert('Error adding project')
      return
    }
    // Optimistic or Refetch
    // Supabase returns array
    if (data) projects.value.unshift(data[0])
  }

  async function updateProject(updatedProject) {
    const { error } = await supabase
      .from('projects')
      .update(updatedProject)
      .eq('id', updatedProject.id)

    if (error) {
      console.error('Error updating project:', error)
      return
    }
    // Update local state
    const index = projects.value.findIndex((p) => p.id === updatedProject.id)
    if (index !== -1) projects.value[index] = updatedProject
  }

  async function deleteProject(id) {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) {
      console.error('Error deleting project:', error)
      return
    }
    projects.value = projects.value.filter((p) => p.id !== id)
  }

  function getProjectById(id) {
    return projects.value.find((p) => p.id === Number(id))
  }

  function getAllProjects() {
    return projects.value
  }

  // --- Profile ---

  async function fetchProfile() {
    // Assuming single-user profile for now (id 1 or just take the first one)
    const { data, error } = await supabase.from('profile').select('*').order('id', { ascending: true }).limit(1).single()
    if (error) {
      console.error('Error fetching profile:', error)
      return
    }
    if (data) {
      // --- Mock Data Injection for System Monitor (Phase 2.5) ---
      // This ensures the dashboard has data even if the DB is empty or missing fields.
      const enrichedExperience = (data.experience || []).map((exp, index) => {
        // Default Mock Metrics based on index (just for variety)
        const mockGrowth = [
          { value: 300, label: 'Efficiency', suffix: '%' },
          { value: 120, label: 'User Growth', suffix: '%' },
          { value: 50, label: 'Cost Reduction', suffix: '%' },
          { value: 99.9, label: 'Uptime', suffix: '%' },
        ][index % 4]

        const mockRadar = [
          [ // Tech Lead
            { label: 'Architecture', value: 95 },
            { label: 'Leadership', value: 85 },
            { label: 'Coding', value: 90 },
            { label: 'System Design', value: 88 },
            { label: 'Communication', value: 80 },
          ],
          [ // Senior Dev
            { label: 'Frontend', value: 95 },
            { label: 'Backend', value: 85 },
            { label: 'DevOps', value: 70 },
            { label: 'Testing', value: 80 },
            { label: 'Mentoring', value: 60 },
          ],
          [ // Junior
            { label: 'Learning', value: 100 },
            { label: 'Coding', value: 75 },
            { label: 'Teamwork', value: 85 },
            { label: 'Debugging', value: 70 },
            { label: 'Documentation', value: 60 },
          ],
          [ // Intern
            { label: 'Passion', value: 100 },
            { label: 'Energy', value: 100 },
            { label: 'Coding', value: 50 },
            { label: 'Coffee', value: 20 },
            { label: 'Git', value: 40 },
          ],
        ][index % 4]

        return {
          ...exp,
          growth: exp.growth || mockGrowth,
          radar: exp.radar || mockRadar
        }
      })

      profile.value = {
        ...data,
        experience: enrichedExperience
      }
    }
  }

  function getProfile() {
    return profile.value
  }

  async function updateProfile(newProfile) {
    // Use the ID from the payload, fallback to 1 only if missing
    const id = newProfile.id || 1
    const { error } = await supabase.from('profile').update(newProfile).eq('id', id)

    if (error) {
      console.error('Error updating profile:', error)
      alert('Save failed')
      return
    }
    profile.value = newProfile
  }

  // --- Computed project types ---
  // (Adding these back to support DesignView usage)
  const designProjects = computed(() => projects.value.filter(p => p.type === 'DESIGN' || p.category === 'UI/UX' || p.category === 'Visual'))
  const pmProjects = computed(() => projects.value.filter(p => p.type === 'PM')) // Optional helper

  return {
    projects,
    profile,
    isLoading,
    designProjects, // Unlocks the gallery
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    getAllProjects,
    fetchProfile,
    getProfile,
    updateProfile,
  }
})
