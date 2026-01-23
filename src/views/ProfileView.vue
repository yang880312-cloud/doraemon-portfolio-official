<script setup>
import { useRouter } from 'vue-router'
import ProfileHologram from './Profile/ProfileHologram.vue'

const router = useRouter()

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="w-full h-screen bg-[#111]">
    <ProfileHologram @back="goBack" />
  </div>
</template>
