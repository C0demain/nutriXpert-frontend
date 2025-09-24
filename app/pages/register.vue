<script setup lang="ts">
import { Password, useToast } from 'primevue'

const name = ref("")
const email = ref("")
const password = ref("")
const role = ref("ADMIN") 

const toast = useToast()

async function handleRegister(event: SubmitEvent){
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
        switch(error.value.statusCode){
            case 400:
                toast.add({summary: 'Erro', detail: 'Dados inválidos. Verifique e tente novamente.', severity: 'error', life: 4000})
                break
            case 409:
                toast.add({summary: 'Erro', detail: 'Usuário já existe.', severity: 'error', life: 4000})
                break
            default:
                toast.add({summary: 'Erro', detail: 'Não foi possível cadastrar. Tente novamente.', severity: 'error', life: 4000})
        }
    } else {
        toast.add({summary: 'Sucesso', detail: 'Usuário cadastrado com sucesso!', severity: 'success', life: 4000})
        navigateTo('/login')
    }
}
</script>

<template>
    <form
        class="flex flex-col gap-4 p-4 rounded-lg border border-gray-200 max-w-3/6 mx-auto mt-10 h-full"
        @submit.prevent="handleRegister"
    >
        <h1 class="page-title">Cadastro de Usuário</h1>

        <div class="flex flex-col gap-2">
            <label for="name">Nome</label>
            <InputText id="name" type="text" required v-model="name" />
        </div>

        <div class="flex flex-col gap-2">
            <label for="email">Email</label>
            <InputText id="email" type="email" required v-model="email" />
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

        <div class="flex flex-col gap-2">
            <label for="role">Função</label>
            <Dropdown
                id="role"
                v-model="role"
                :options="['USER','ADMIN']"
                placeholder="Selecione a função"
            />
        </div>

        <Button label="Cadastrar" type="submit" class="bg-green-600"/>
        
        <RouterLink 
            to="/login"
            class="text-center mt-2 font-semibold"
            style="color: #42b883;"
        >
            Já tenho conta
        </RouterLink>
    </form>
</template>
