<script setup lang="ts">
const fullPages = ["/", "/login", "/register"];
const route = useRoute();
const isFullPage = computed(() => fullPages.includes(route.path));
</script>

<template>
  <div :class="isFullPage ? 'w-full' : 'w-11/12 mx-auto'" class="h-svh">
    <Toast position="bottom-right" />
    <NuxtLayout
      :name="useCookie('role').value === 'ADMIN' ? 'admin' : 'default'"
    >
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
