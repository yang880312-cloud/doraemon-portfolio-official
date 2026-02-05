<script setup>
import { useRouter } from 'vue-router'
// import ProfileHologram from './Profile/ProfileHologram.vue' // OLD
import ProfileTimeMachine from '@/components/Profile/ProfileTimeMachine.vue' // NEW

const router = useRouter()

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="w-full min-h-screen bg-[#111]">
    <ProfileTimeMachine @back="goBack" />
  </div>
</template>
