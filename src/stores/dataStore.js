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
      projects.value = data || []
      lastFetch.value = Date.now()
    } catch (err) {
      console.error('Error fetching projects:', err)
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
    if (data) profile.value = data
  }

  function getProfile() {
    return profile.value
  }

  async function updateProfile(newProfile) {
    // Assuming we update the profile with ID 1, or the ID we fetched
    const id = profile.value.id || 1
    const { error } = await supabase.from('profile').update(newProfile).eq('id', id)

    if (error) {
      console.error('Error updating profile:', error)
      alert('Save failed')
      return
    }
    profile.value = newProfile
  }

  return {
    projects,
    profile,
    isLoading,
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
