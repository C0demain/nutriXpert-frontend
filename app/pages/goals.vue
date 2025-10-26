<script setup lang="ts">
import type { Goal } from '~/types/Goal'

const authStore = useAuthStore()
const toast = useToast()

const isModalVisible = ref(false)

const {data: goals, error, pending} = await useAPI<Goal[]>(`/goals/user/${authStore.userId}`, {key: 'user-goals'})
if(error.value){
    toast.add({summary: "Erro", detail: "Não foi possível carregar seus objetivos nutricionais. Tente novamente mais tarde", severity: 'error', life: 3000})
}

async function refresh(){
    await refreshNuxtData(['user-goals'])
}

async function deleteGoal(id: number){
    const {error} = await useAPI(`/goals/${id}`, {method: 'DELETE'})
    if(error.value){
        toast.add({summary: "Erro", detail: "Não foi possível carregar seus objetivos nutricionais. Tente novamente mais tarde", severity: 'error', life: 3000})
    }else{
        toast.add({summary: "Sucesso", detail: "Objetivo excluído com sucesso", severity: 'success', life: 3000})
        await refresh()
    }
}
</script>


<template>
    <h1 class="page-title">Objetivos nutricionais</h1>
    <NewGoalModal v-model:visible="isModalVisible"/>

    <Button class="w-full my-6" icon="pi pi-plus" label="Novo objetivo" @click="isModalVisible = true"/>
    <ProgressSpinner v-if="pending"/>
    <div class="grid grid-cols-2 gap-6" v-else>
        <Panel :header="goal.description" class="w-full flex" v-for="goal in goals">
            <div class="flex w-full">
                <div class="w-full flex flex-col items-center">
                    <p class="text-md">Meta de peso</p>
                    <div class="flex items-baseline">
                        <p class="text-6xl">{{ goal.targetWeight }}</p>
                        <span>Kg</span>
                    </div>
                </div>
                <div class="w-full flex flex-col items-center">
                    <p class="text-md">Meta de calorias</p>
                    <div class="flex items-baseline">
                        <p class="text-6xl">{{ goal.targetCalories }}</p>
                        <span>Kcal</span>
                    </div>
                </div>
            </div>
            <template #footer>
                <div class="w-full flex justify-between">
                    <Badge severity="info" class="mt-auto">{{ goal.goalType }}</Badge>
                    <Button icon="pi pi-trash" severity="danger" @click="deleteGoal(goal.id)"/>
                </div>
            </template>
        </Panel>
    </div>
</template>