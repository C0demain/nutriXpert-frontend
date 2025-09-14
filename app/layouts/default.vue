<script setup lang="ts">
const {isLoggedIn, logout} = useAuthStore()

function handleLogout(){
    logout()
    navigateTo('/login', {external: true})
}
</script>

<template>
  <div>
    <div class="flex justify-end w-10/12">
        <Button v-if="isLoggedIn" outlined label="Logout" @click="handleLogout"/>
    </div>
    <slot /> 
  </div>
</template>