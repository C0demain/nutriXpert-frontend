<script setup>
const visible = ref(false);
const toast = useToast();
const authStore = useAuthStore();
const links = [
  { icon: "pi pi-comments", label: "Chat", to: "/chat" },
  { icon: "pi pi-calendar-times", label: "Refeições", to: "/refeicoes" },
  { icon: "pi pi-heart", label: "Anamnese", to: "/anamnese" },
  { icon: "pi pi-flag", label: "Objetivos nutricionais", to: "/goals" },
  { icon: "pi pi-user", label: "Perfil", to: "/profile" },
];

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

<template>
  <Drawer v-model:visible="visible" header="Menu" v-if="authStore.isLoggedIn">
    <div class="flex flex-col justify-between h-full">
      <div class="flex flex-col gap-2">
        <NuxtLink
          v-for="link in links"
          :to="link.to"
          class="p-3 rounded-lg hover:text-primary hover:bg-zinc-100 flex items-center gap-3 transition-colors"
          active-class="opacity-40"
        >
          <i :class="link.icon"></i>
          <span>{{ link.label }}</span>
        </NuxtLink>
      </div>
    </div>
    <template #footer>
      <Button
        outlined
        label="Logout"
        @click="handleLogout"
        icon="pi pi-sign-out"
        class="w-full"
      />
    </template>
  </Drawer>
  <Button
    @click="visible = true"
    v-if="authStore.isLoggedIn"
    variant="text"
    class="mb-4 !text-black"
    icon="pi pi-bars"
    label="Menu"
  />
</template>
