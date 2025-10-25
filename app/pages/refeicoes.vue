<template>
    <div class="sticky top-10 bg-white">
        <h1 class="page-title">Refeições</h1>
        <NewMeal/>
        <div class="flex">
            <div class="flex flex-col">
                <label></label>
            </div>
        </div>
    </div>
    <Accordion>
        <AccordionPanel v-for="meal in meals" :key="meal.id" :value="meal.id">
            <AccordionHeader>
                <div class="space-x-6">
                    <span class="text-sm">{{ formatDateString(meal.mealDateTime) }}</span>
                    <span>{{ meal.type }}</span>
                    <span>{{ meal.description }}</span>
                </div>
            </AccordionHeader>
            <AccordionContent>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>

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
    toast.add({summary: "Erro", detail: "Não foi possível carregar suas refeições. Tente novamente mais tarde", severity: 'error'})
}
</script>