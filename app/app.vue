<template>
  <div class="w-11/12 h-svh mx-auto">
    <Toast position="bottom-right" />
    <NuxtLayout :name="useCookie('userRole').value === 'ADMIN' ? 'admin' : 'default'">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
