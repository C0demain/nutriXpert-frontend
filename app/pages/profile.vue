<script setup lang="ts">

import { Password, useToast } from "primevue";
import { useConfirm } from "primevue/useconfirm";

interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  password: string;
}

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();

const { data: userInfo, error: fetchError } = await useAPI<UserResponse>(
  `/user/${authStore.userId}`,
);

if (fetchError.value) {
  toast.add({
    severity: "error",
    summary: "Erro",
    detail: "Não foi possível carregar os dados do usuário.",
    life: 3000
  });
}

const name = ref(userInfo.value?.name || "");
const email = ref(userInfo.value?.email || "");
const password = ref("");
const confirmPassword = ref("");


const showPassword = ref(false);
const showConfirmPassword = ref(false);

async function handleSubmit() {

  if (password.value && password.value !== confirmPassword.value) {
    toast.add({
      severity: "warn",
      summary: "Atenção",
      detail: "As senhas não coincidem.",
      life: 3000
    });
    return;
  }

  const { error } = await useAPI(`/user/${authStore.userId}`, {
    method: "patch",
    body: {
      name: name.value,
      email: email.value,
      password: password.value || undefined,
      role: userInfo.value?.role,
    },
  });

  if (error.value) {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Não foi possível atualizar os dados.",
      life: 3000
    });
  } else {
    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Perfil atualizado com sucesso! Faça novamente o login com as novas informações.",
      life: 3000
    });
    authStore.logout();
    router.push("/login");
  }
}

const confirm = useConfirm();

async function handleDelete() {
  confirm.require({
    message: "Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.",
    header: "Confirmação de Exclusão",
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    acceptLabel: "Sim, excluir",
    rejectLabel: "Cancelar",

    accept: async () => {
      const { error } = await useAPI(`/user/${authStore.userId}`, {
        method: "delete",
      });

      if (error.value) {
        toast.add({
          severity: "error",
          summary: "Erro",
          detail: "Não foi possível excluir a conta.",
          life: 3000
        });
      } else {
        toast.add({
          severity: "success",
          summary: "Conta excluída",
          detail: "Sua conta foi excluída com sucesso.",
          life: 3000
        });
        authStore.logout();
        router.push("/login");
      }
    },

    reject: () => {
      toast.add({
        severity: "info",
        summary: "Cancelado",
        detail: "A exclusão foi cancelada.",
        life: 3000
      });
    },
  });
}
</script>


<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh]">
    <form class="w-full max-w-lg bg-neutral-100 rounded-lg shadow-md p-8 flex flex-col gap-6"
      @submit.prevent="handleSubmit">
      <h1 class="page-title mb-8 text-2xl font-bold text-center">Perfil</h1>
      <div class="grid grid-cols-1 gap-4">
        <div class="flex flex-col gap-2">
          <label for="name" class="font-medium">Nome</label>
          <InputText v-model="name" id="name" class="w-full" />
        </div>

        <div class="flex flex-col gap-2">
          <label for="email" class="font-medium">Email</label>
          <InputText v-model="email" id="email" class="w-full" />
        </div>


        <div class="flex flex-col gap-2">
          <label for="password" class="font-medium">Nova Senha</label>
          <Password id="password" v-model="password" fluid toggleMask :feedback="false"
            placeholder="Digite sua nova senha" />
          <small class="text-gray-400">*Deixe em branco para não alterar a senha.*</small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="confirmPassword" class="font-medium">Confirmar Nova Senha</label>
          <Password id="confirmPassword" v-model="confirmPassword" fluid toggleMask :feedback="false"
            placeholder="Confirme sua nova senha" />
        </div>

        <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-400"
          @click="showConfirmPassword = !showConfirmPassword">
        </button>
      </div>

      <div class="flex gap-4 justify-center mt-4">
        <Button type="submit" class="px-6 py-2">Salvar Alterações</Button>

        <Button type="button" severity="danger" class="px-6 py-2" @click="handleDelete">
          Excluir Conta
        </Button>
      </div>
    </form>
    <ConfirmDialog />
  </div>
</template>
