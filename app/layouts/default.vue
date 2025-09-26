<!-- Layout.vue -->
<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-end w-full p-2 bg-gray-100">
      <Button v-if="authStore.isLoggedIn" outlined label="Logout" @click="handleLogout"/>
    </div>
    <div class="flex-1 overflow-hidden">
      <slot /> 
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

function handleLogout(){
    authStore.logout()
    navigateTo('/login')
}
</script>
