<template>
  <Drawer v-model:visible="visible" header="Menu" v-if="authStore.isLoggedIn">
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
  <Button @click="visible = true" v-if="authStore.isLoggedIn" variant="text" class="mb-4 !text-black" icon="pi pi-bars"
    label="Menu" />
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
