<template>

  <Button @click="visible = true" v-if="authStore.isLoggedIn" variant="text"
    class="fixed top-0 left-0 !text-black z-20 mt-2" icon="pi pi-bars" label="Menu" />

  <header v-if="authStore.isLoggedIn"
    class="fixed top-0 left-0 w-full h-15 bg-white shadow-md flex items-center justify-center z-10">

    <div class="flex items-center">
      <img src="~/assets/img/logotipo.png" alt="Logo" class="w-50"/>
    </div>

    <Drawer v-model:visible="visible" header="Menu">
      <div class="flex flex-col justify-between h-full">
        <div class="flex flex-col gap-2">
          <NuxtLink to="/admin/users"
            class="p-3 rounded-lg hover:text-primary hover:bg-zinc-100 flex items-center gap-3 transition-colors"
            active-class="opacity-40">
            <i class="pi pi-user"></i>
            <span>Usuários</span>
          </NuxtLink>
        </div>
      </div>
      <template #footer>
        <Button outlined label="Logout" @click="handleLogout" icon="pi pi-sign-out" class="w-full" />
      </template>
    </Drawer>
  </header>

  <div v-if="authStore.isLoggedIn" class="pt-16">
  </div>
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
