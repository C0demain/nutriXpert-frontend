<template>
  <div class="w-11/12 h-svh mx-auto">
    <Toast position="bottom-right" />
    <NuxtLayout :name="authStore.isAdmin ? 'admin' : 'default'">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
</script>
