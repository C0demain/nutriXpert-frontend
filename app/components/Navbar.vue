<template>
    <Drawer v-model:visible="visible" header="Menu" v-if="authStore.isLoggedIn">
            <div class="flex flex-col justify-between">
                <div class="flex flex-col">
                    <NuxtLink to="" class="opacity-40 p-2 rounded-lg hover:text-primary hover:bg-zinc-100 dark:hover:bg-zinc-800 align-middle">Chat</NuxtLink>
                    <NuxtLink to="/anamnese" class="p-2 rounded-lg hover:text-primary hover:bg-zinc-100 dark:hover:bg-zinc-800 align-middle">Anamnese</NuxtLink>
                    <NuxtLink to="/profile" class="p-2 rounded-lg hover:text-primary hover:bg-zinc-100 dark:hover:bg-zinc-800 align-middle">Perfil</NuxtLink>
                </div>
            </div>
            <template #footer>
                <Button outlined label="Logout" @click="handleLogout" icon="pi pi-sign-out" class="!mx-auto"/>
            </template>
        </Drawer>
        <Button @click="visible = true" v-if="authStore.isLoggedIn" variant="text" class="mb-4 !text-black dark:!text-white" icon="pi pi-bars" label="Menu"/>
</template>

<script setup>
const visible = ref(false)
const toast = useToast()

const authStore = useAuthStore()

function handleLogout(){
    authStore.logout()
    toast.add({severity: 'info', summary: 'Você saiu'})
    navigateTo('/login')
}
</script>