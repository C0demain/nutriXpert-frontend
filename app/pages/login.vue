<script setup lang="ts">
import { Password, useToast } from 'primevue'

const email = ref("")
const password = ref("")

const toast = useToast()
const authStore = useAuthStore()

interface LoginResponse{
    token: string,
    id: string
}

async function handleFormSubmit(event: SubmitEvent){
    const {data, error} = await useAPI<LoginResponse>('/auth/login', {
        method: 'post',
        body: {
            email: email.value,
            password: password.value
        }
    })
    
    if(error.value){
        switch (error.value.statusCode){
            case 500:
                toast.add({summary: 'Falha no login', detail: 'Algo deu errado. Tente novamente', severity: 'error', life: 4000})
                break
                case 403:
                toast.add({summary: 'Falha no login', detail: 'Email ou senha incorretos. Tente novamente', severity: 'error', life: 4000})
                break
            case 404:
                toast.add({summary: 'Falha no login', detail: 'Algo deu errado. Tente novamente', severity: 'error', life: 4000})
                break
            case 400:
                toast.add({summary: 'Falha no login', detail: 'Email ou senha incorretos. Tente novamente', severity: 'error', life: 4000})
                break
        }
    }else{
        authStore.setToken(data.value?.token || '')
        authStore.setUserId(data.value?.id || '')
        toast.add({summary: 'Successo', detail: 'Login realizado com sucesso', severity: 'success', life: 4000})
        navigateTo('/')
    }
    }

</script>

<template>
    <form class="flex flex-col gap-4 p-4 rounded-lg border border-gray-200 max-w-3/6 mx-auto mt-10 h-full" @submit.prevent="handleFormSubmit">
        <h1 class="page-title">Login</h1>
        <div class="flex flex-col gap-2"> 
            <label for="email">Email</label>
            <InputText id="email" type="email" required v-model="email"/>
        </div>
        <div class="flex flex-col gap-2">
            <label for="password">Senha</label>
            <Password
            id="password"
            fluid
            toggleMask
            required
            :feedback="false"
            v-model="password"
            />
        </div>
        <Button label="Entrar" type="submit" class="bg-red-600"/>

        <RouterLink 
            to="/register"
            class="text-center mt-2 font-semibold"
            style="color: #42b883;"
        >
            Criar nova conta
        </RouterLink>
    </form>

</template>

<style module>
 .test{
    background-color: red;
 }
</style>