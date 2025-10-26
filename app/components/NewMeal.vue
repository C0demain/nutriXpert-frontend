<script setup lang="ts">

const mealTypeOpts = [
    {label: 'Café da manhã', value: 'BREAKFAST'},
    {label: 'Lanche', value: 'SNACK'},
    {label: 'Almoço', value: 'LUNCH'},
    {label: 'Lanche da tarde', value: 'AFTERNOON_SNACK'},
    {label: 'Jantar', value: 'DINNER'},
    {label: 'Ceia', value: 'SUPPER'},
]

const { userId } = useAuthStore()
const toast = useToast()

const mealDateTime = ref(new Date())
const mealType = ref()
const description = ref("")

async function handleSubmit(){
    const {error} = await useAPI('/api/v1/meals', {
        method:'post',
        query: { userId },
        body: {
            description: description.value,
            type: mealType.value,
            mealDateTime: mealDateTime.value,
        }
    })

    if(error.value){
        toast.add({severity: 'error', summary: 'Erro ao adicionar refeição', detail: 'Algo deu errado. Tente novamente', life: 2500})
    }else{
        toast.add({severity: 'success', summary: 'Sucesso', detail: 'Refeição registrada com sucesso', life: 2500})
        description.value = '',
        mealDateTime.value = new Date()
        mealType.value = undefined
        refreshNuxtData('meals')
    }
}
</script>

<template>
    <form class="flex gap-4 w-full items-end" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-2">
            <label for="mealDateTime">Data</label>
            <DatePicker v-model="mealDateTime" id="mealDateTime" date-format="dd/mm/yy" fluid/>
        </div>
        <div class="flex flex-col gap-2 w-4/12">
            <label for="mealType">Tipo de refeição</label>
            <Select v-model="mealType" id="mealType" :options="mealTypeOpts" option-label="label" option-value="value" fluid/>
        </div>
        <div class="flex flex-col gap-2 w-6/12">
            <label for="description">Descrição</label>
            <InputText v-model="description" id="description" fluid/>
        </div>
        <Button type="submit" class="w-2/12">Adicionar</Button>
    </form>
</template>