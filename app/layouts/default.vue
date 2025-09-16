<script setup lang="ts">
const authStore = useAuthStore()

function handleLogout(){
    authStore.logout()
    navigateTo('/login')
}
</script>

<template>
  <div>
    <div class="flex justify-end w-10/12">
        <Button v-if="authStore.isLoggedIn" outlined label="Logout" @click="handleLogout"/>
    </div>
    <slot /> 
  </div>
</template>