<script setup lang="ts">
import { Password, useToast } from 'primevue'
import type { Role } from '~/types/Role'

const email = ref("")
const password = ref("")

const toast = useToast()
const authStore = useAuthStore()

interface LoginResponse {
    token: string,
    id: string,
    role: Role
}

async function handleFormSubmit(event: SubmitEvent) {
    const { data, error } = await useAPI<LoginResponse>('/auth/login', {
        method: 'post',
        body: {
            email: email.value,
            password: password.value
        }
    })

    if (error.value) {
        switch (error.value.statusCode) {
            case 500:
                toast.add({
                    summary: 'Falha no login',
                    detail: 'Algo deu errado. Tente novamente',
                    severity: 'error',
                    life: 4000
                })
                break
            case 403:
                toast.add({
                    summary: 'Falha no login',
                    detail: 'Email ou senha incorretos. Tente novamente',
                    severity: 'error',
                    life: 4000
                })
                break
            case 404:
                toast.add({
                    summary: 'Falha no login',
                    detail: 'Algo deu errado. Tente novamente',
                    severity: 'error',
                    life: 4000
                })
                break
            case 400:
                toast.add({
                    summary: 'Falha no login',
                    detail: 'Email ou senha incorretos. Tente novamente',
                    severity: 'error',
                    life: 4000
                })
                break
        }
    } else {
        console.log(data.value)
        authStore.setToken(data.value?.token || '')
        authStore.setUserId(data.value?.id || '')
        authStore.setRole(String(data.value?.role || ''))

        toast.add({
            summary: 'Successo',
            detail: 'Login realizado com sucesso',
            severity: 'success',
            life: 4000
        })

        navigateTo('/chat')
    }
}

</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-50">
        <form
            class="flex flex-col gap-6 p-8 rounded-xl border border-gray-300 w-full max-w-lg mx-auto bg-white shadow-2xl min-h-[400px]"
            @submit.prevent="handleFormSubmit">

            <img src="~/assets/img/logotipo.png"alt="Logo" class="p-4" />

            <div class="flex flex-col gap-2">
                <label for="email">Email</label>
                <InputText id="email" type="email" required v-model="email" placeholder="Digite o seu e-mail" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="password">Senha</label>
                <Password id="password" fluid toggleMask required :feedback="false" v-model="password" placeholder="Digite a sua senha" />
            </div>

            <Button label="Entrar" type="submit" class="bg-red-600 h-12 text-lg font-medium" />

            <RouterLink to="/register" class="text-center mt-3 font-semibold hover:underline">
                Não possui uma conta? Clique aqui para criar uma.
            </RouterLink>
        </form>
    </div>
</template>


<style module>
.test {
    background-color: red;
}
</style>