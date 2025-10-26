<script setup lang="ts">
import { AccordionPanel } from 'primevue'
import type { Meal } from '~/types/Meal'

const { userId } = useAuthStore()
const toast = useToast()
const {data: meals, refresh, error} = await useAPI<Meal[]>('/api/v1/meals', {
    query: {
        userId
    },
    key: 'meals'
})

if(error.value){
    toast.add({summary: "Erro", detail: "Não foi possível carregar suas refeições. Tente novamente mais tarde", severity: 'error', life: 2500})
}

async function deleteMeal(mealId: number){
    const {error} = await useAPI(`/api/v1/meals/${mealId}`, {method: 'delete'})
    if(error.value){
        toast.add({summary: "Erro", detail: "Não foi excluir essa refeição. Tente novamente mais tarde", severity: 'error', life: 2500})
        return
    }

    toast.add({summary: 'Sucesso', detail: 'Refeição excluída com sucesso', severity: 'success', life: 2500})

    await refresh()
}

</script>

<template>
    <div class="sticky top-10 bg-white">
        <h1 class="page-title">Refeições</h1>
        <NewMeal/>
    </div>
    <Accordion>
        <AccordionPanel v-for="meal in meals" :value="meal.id" :key="meal.id">
            <AccordionHeader class="flex justify-between items-center">
                <div class="space-x-6 w-11/12">
                    <span class="text-sm">{{ formatDateString(meal.mealDateTime) }}</span>
                    <span>{{ translateMealType(meal.type) }}</span>
                    <span>{{ meal.description }}</span>
                </div>
                <Button @click="async () => await deleteMeal(meal.id)" severity="danger" icon="pi pi-trash" :ariaUserId="meal.userId"/>
            </AccordionHeader>
            <AccordionContent v-if="meal">
                <NewFood :mealId="meal.id"/>
                <FoodList :mealId="meal.id"/>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>