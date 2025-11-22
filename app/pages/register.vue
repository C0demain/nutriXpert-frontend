<script setup lang="ts">
import { Password, useToast } from 'primevue'

enum UserRole {
    Usuário = 'USER',
    Administrador = 'ADMIN',
}

const roles = [
    { label: 'Usuário Comum', value: UserRole.Usuário },
    { label: 'Administrador', value: UserRole.Administrador },
]

const name = ref("")
const email = ref("")
const password = ref("")
const role = ref<UserRole>(UserRole.Administrador)

const toast = useToast()

async function handleRegister(event: SubmitEvent) {
    const { data, error } = await useAPI('/auth/register', {
        method: 'post',
        body: {
            name: name.value,
            email: email.value,
            password: password.value,
            role: role.value
        }
    })

    if (error.value) {
        switch (error.value.statusCode) {
            case 400:
                toast.add({ summary: 'Erro', detail: 'Dados inválidos. Verifique e tente novamente.', severity: 'error', life: 4000 })
                break
            case 409:
                toast.add({ summary: 'Erro', detail: 'Usuário já existe.', severity: 'error', life: 4000 })
                break
            default:
                toast.add({ summary: 'Erro', detail: 'Não foi possível cadastrar. Tente novamente.', severity: 'error', life: 4000 })
        }
    } else {
        toast.add({ summary: 'Sucesso', detail: 'Usuário cadastrado com sucesso!', severity: 'success', life: 4000 })
        navigateTo('/login')
    }
}
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-50 bg-[url(~/assets/img/waves.svg)] bg-cover bg-center bg-no-repeat">
        <form
            class="flex flex-col gap-6 p-8 rounded-xl border border-gray-300 w-full max-w-lg mx-auto bg-white shadow-2xl min-h-[400px]"
            @submit.prevent="handleRegister">
            
            <img src="~/assets/img/logotipo.png" alt="Logo" class="p-4" />

            <div class="flex flex-col gap-2">
                <label for="name">Nome</label>
                <InputText id="name" type="text" required v-model="name" placeholder="Digite o seu nome" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="email">Email</label>
                <InputText id="email" type="email" required v-model="email" placeholder="Digite o seu email" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="password">Senha</label>
                <Password id="password" fluid toggleMask required :feedback="false" v-model="password"
                    placeholder="Digite a sua senha" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="role">Função</label>
                <Dropdown id="role" v-model="role" :options="roles" optionLabel="label" optionValue="value"
                    placeholder="Selecione a função" />
            </div>

            <Button label="Cadastrar" type="submit" class="bg-green-600" />

            <RouterLink to="/login" class="text-center mt-2 font-semibold hover:underline">
                Já possui uma conta? Faça login aqui.
            </RouterLink>
        </form>
    </div>
</template>
