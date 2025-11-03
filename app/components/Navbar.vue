<template>
  <header v-if="authStore.isLoggedIn"
    class="fixed top-0 left-0 w-full h-15 bg-white shadow-md flex items-center justify-center z-10">

    <Drawer v-model:visible="visible" header="Menu" v-if="authStore.isLoggedIn">

      <div class="flex flex-col justify-between h-full">
        <div class="flex flex-col gap-2">
          <NuxtLink to="/chat"
            class="p-3 rounded-lg hover:text-primary hover:bg-zinc-100 flex items-center gap-3 transition-colors"
            active-class="opacity-40">
            <i class="pi pi-comments"></i>
            <span>Chat</span>
          </NuxtLink>
          <NuxtLink to="/refeicoes"
            class="p-3 rounded-lg hover:text-primary hover:bg-zinc-100 flex items-center gap-3 transition-colors"
            active-class="opacity-40">
            <i class="pi pi-calendar-times"></i>
            <span>Refeicoes</span>
          </NuxtLink>
          <NuxtLink to="/anamnese"
            class="p-3 rounded-lg hover:text-primary hover:bg-zinc-100 flex items-center gap-3 transition-colors"
            active-class="opacity-40">
            <i class="pi pi-heart"></i>
            <span>Anamnese</span>
          </NuxtLink>
          <NuxtLink to="/goals"
            class="p-3 rounded-lg hover:text-primary hover:bg-zinc-100 flex items-center gap-3 transition-colors"
            active-class="opacity-40">
            <i class="pi pi-flag"></i>
            <span>Objetivos nutricionais</span>
          </NuxtLink>
          <NuxtLink to="/profile"
            class="p-3 rounded-lg hover:text-primary hover:bg-zinc-100 flex items-center gap-3 transition-colors"
            active-class="opacity-40">
            <i class="pi pi-user"></i>
            <span>Perfil</span>
          </NuxtLink>
        </div>
      </div>
      <template #footer>
        <Button outlined label="Logout" @click="handleLogout" icon="pi pi-sign-out" class="w-full" />
      </template>
    </Drawer>
  </header>

</template>

<script setup>
const visible = ref(false);
const toast = useToast();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  toast.add({
    severity: "info",
    summary: "Você saiu",
    life: 3000,
  });
  navigateTo("/login");
}
</script>
