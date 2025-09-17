<script setup lang="ts">
interface UserResponse{
    id: string,
    name: string,
    email: string,
    role: string,
    height: number | null
    weight: number | null,
    habits: string | null,
    illnesses: string | null,
}
const toast = useToast()
const authStore = useAuthStore()
const {data: userInfo} = await useAPI<UserResponse>(`/user/${authStore.userId}`)

const illnessOpts = ['Diabetes', 'Intolerância à lactose', 'Celíaco']

const weight = ref(userInfo.value?.weight)
const height = ref(userInfo.value?.height)
const illnesses = ref(userInfo.value?.illnesses?.split(','))

async function handleSubmit(){
    const {error} = await useAPI(`/user/anamnese/${authStore.userId}`, {
        method: 'patch',
        body: {
            weight: weight.value,
            height: height.value,
            illnesses: illnesses.value?.join(',')
        }
    })

    if(error.value){
        switch (error.value.statusCode){
            case 500:
                toast.add({severity: 'error', summary: 'Erro ao enviar', detail: 'Algo deu errado. Tente novamente'})
        }
    }else{
        toast.add({severity: 'success', summary: 'Sucesso', detail: 'Anamnese enviada com sucesso'})
    }
    
}

</script>

<template>
    <h1 class="page-title">Anamnese</h1>
    <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
        <div class="flex gap-6">
            <div class="flex flex-col gap-2">
                <label for="weight">Peso</label>
                <InputGroup>
                    <InputNumber v-model="weight" id="weight"/>
                    <InputGroupAddon>Kg</InputGroupAddon>
                </InputGroup>
            </div>
            <div class="flex flex-col gap-2">
                <label for="height">Altura</label>
                <InputGroup>
                    <InputNumber v-model="height" id="height"/>
                    <InputGroupAddon>cm</InputGroupAddon>
                </InputGroup>
            </div>
        </div>
        <div class="flex flex-col gap-2">
            <label for="illnesses">Condições</label>
            <MultiSelect v-model="illnesses" :options="illnessOpts"/>
        </div>
        <Button type="submit">Enviar</Button>
    </form>
</template>