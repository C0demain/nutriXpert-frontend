<script setup lang="ts">
const { mealId } = defineProps({mealId: {required: true, type: Number} })
const toast = useToast()
const foodName = ref('')
const calories = ref(0)
const protein = ref(0)
const carbohydrates = ref(0)
const fat = ref(0)


async function handleSubmit(){
    const {error} = await useAPI('/api/v1/foods', {
        method:'post',
        body: {
            mealId,
            foodName,
            calories,
            protein,
            carbohydrates,
            fat
        }
    })

    if(error.value){
        toast.add({
            severity: 'error', 
            summary: 'Erro ao adicionar comida', 
            detail: 'Algo deu errado. Tente novamente', 
            life: 2500
        })
    }else{
        toast.add({
            severity: 'success', 
            summary: 'Sucesso', 
            detail: 'Comida registrada com sucesso', 
            life: 2500
        })
        await refreshNuxtData(`${mealId}:foods`)
    }
}
</script>

<template>
    <form class="flex gap-4 w-full items-end" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-2 w-4/12">
            <label for="foodName">Nome</label>
            <InputText v-model="foodName" id="foodName" size="small" fluid/>
        </div>
        <div class="flex flex-col gap-2 w-3/12">
            <label for="calories">Calorias</label>
            <InputNumber v-model="calories" id="calories" size="small" fluid/>
        </div>
        <div class="flex flex-col gap-2 w-3/12">
            <label for="protein">Proteínas</label>
            <InputNumber v-model="protein" id="protein" size="small" fluid/>
        </div>
        <div class="flex flex-col gap-2 w-3/12">
            <label for="carbohydrates">Carboidratos</label>
            <InputNumber v-model="carbohydrates" id="carbohydrates" size="small" fluid/>
        </div>
        <div class="flex flex-col gap-2 w-3/12">
            <label for="fat">Gordura</label>
            <InputNumber v-model="fat" id="fat" size="small" fluid/>
        </div>
        
        <Button type="submit" class="w-10/12" size="small">Adicionar comida</Button>
    </form>
</template>