import { createRouter, createWebHistory } from 'vue-router'
import LobbyView from '@/views/LobbyView.vue'
import PMView from '@/views/PMView.vue'
import DesignView from '@/views/DesignView.vue'
import { useDimensionStore } from '@/stores/dimension'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'lobby',
      component: LobbyView,
      meta: { dimension: 'LOBBY' }
    },
    {
      path: '/pm',
      name: 'pm',
      component: PMView,
      meta: { dimension: 'PM' }
    },
    {
      path: '/design',
      name: 'design',
      component: DesignView,
      meta: { dimension: 'DESIGN' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { dimension: 'PROFILE' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const store = useDimensionStore()
  if (to.meta.dimension) {
    store.setDimension(to.meta.dimension)
  }
  next()
})

export default router
