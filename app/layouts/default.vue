<template>
  <div class="h-full">
    <Navbar v-if="!isAuthPage"/>
    <slot /> 
  </div>
</template>

<script setup lang="ts">
const authPages = ["/", "/login", "/register"];
const route = useRoute();
const isAuthPage = computed(() => authPages.includes(route.path));
</script>