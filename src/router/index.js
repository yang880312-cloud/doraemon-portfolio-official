import { createRouter, createWebHistory } from 'vue-router'
import LobbyView from '@/views/LobbyView.vue'
import PMView from '@/views/PMView.vue'
import DesignView from '@/views/DesignView.vue'
import { useDimensionStore } from '@/stores/dimension'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'lobby',
      component: LobbyView,
      meta: { dimension: 'LOBBY' },
    },
    {
      path: '/pm',
      name: 'pm',
      component: PMView,
      meta: { dimension: 'PM' },
    },
    {
      path: '/design',
      name: 'design',
      component: DesignView,
      meta: { dimension: 'DESIGN' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { dimension: 'PROFILE' },
    },
    // Admin Routes
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../views/Admin/LoginView.vue'),
      meta: { dimension: 'ADMIN' },
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('../views/Admin/DashboardView.vue'),
      meta: { dimension: 'ADMIN', requiresAuth: true },
    },
    {
      path: '/admin/project/:id?', // Optional ID for create vs edit
      name: 'admin-project-editor',
      component: () => import('../views/Admin/ProjectEditor.vue'),
      meta: { dimension: 'ADMIN', requiresAuth: true },
    },
    {
      path: '/admin/profile',
      name: 'admin-profile-editor',
      component: () => import('../views/Admin/ProfileEditor.vue'),
      meta: { dimension: 'ADMIN', requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const store = useDimensionStore()

  // 1. Update Dimension State
  if (to.meta.dimension) {
    store.setDimension(to.meta.dimension)
  }

  // 2. Auth Guard
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/admin/login')
  } else {
    next()
  }
})

export default router
