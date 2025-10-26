<script setup lang="ts">
import Dialog from 'primevue/dialog'
import type { Meal } from '~/types/Meal'

const { userId } = useAuthStore()
const toast = useToast()

// Busca refeições do usuário
const { data: meals, refresh, error } = await useAPI<Meal[]>('/meals', {
  query: { userId },
  key: 'meals'
})

if (error.value) {
  toast.add({
    summary: 'Erro',
    detail: 'Não foi possível carregar suas refeições. Tente novamente mais tarde.',
    severity: 'error',
    life: 2500
  })
}

// Estado do modal e da refeição selecionada
const selectedMeal = ref<Meal | null>(null)
const showMealModal = ref(false)

function openMealModal(meal: Meal) {
  selectedMeal.value = meal
  showMealModal.value = true
}

async function deleteMeal(mealId: number) {
  const { error } = await useAPI(`/meals/${mealId}`, { method: 'delete' })
  if (error.value) {
    toast.add({
      summary: 'Erro',
      detail: 'Não foi possível excluir essa refeição. Tente novamente mais tarde.',
      severity: 'error',
      life: 2500
    })
    return
  }

  toast.add({
    summary: 'Sucesso',
    detail: 'Refeição excluída com sucesso',
    severity: 'success',
    life: 2500
  })

  await refresh()
}
</script>

<template>
  <!-- Cabeçalho fixo -->
  <div class="sticky top-10 bg-white z-10 pb-3 border-b border-gray-100">
    <h1 class="page-title">Refeições</h1>
    <h2 class="page-subtitle">Adicione e acompanhe suas refeições</h2>
    <NewMeal />
  </div>

  <!-- Lista de refeições -->
  <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="meal in meals"
      :key="meal.id"
      class="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer bg-white flex flex-col justify-between"
      @click="openMealModal(meal)"
    >
      <div class="flex flex-col space-y-1">
        <span class="text-sm text-gray-500">{{ formatDateString(meal.mealDateTime) }}</span>
        <span class="text-emerald-600 font-semibold">{{ translateMealType(meal.type) }}</span>
        <p class="text-gray-700 text-sm truncate">{{ meal.description }}</p>
      </div>
      <Button
        @click.stop="async () => await deleteMeal(meal.id)"
        severity="danger"
        icon="pi pi-trash"
        size="small"
        outlined
        class="self-end mt-3"
      />
    </div>
  </div>

  <!-- Modal da refeição selecionada -->
  <Dialog
    v-model:visible="showMealModal"
    modal
    :header="selectedMeal ? translateMealType(selectedMeal.type) : 'Refeição'"
    :style="{ width: '65rem', maxWidth: '95vw' }"
  >
    <template v-if="selectedMeal">
      <div class="space-y-4">
        <div class="border-b border-gray-200 pb-2">
          <h3 class="font-semibold text-gray-700">
            {{ formatDateString(selectedMeal.mealDateTime) }}
          </h3>
          <p class="text-gray-500 text-sm">
            {{ selectedMeal.description || 'Sem descrição' }}
          </p>
        </div>

        <!-- Formulário de nova comida -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 class="font-semibold text-emerald-700 mb-2">Adicionar alimento</h4>
          <NewFood :mealId="selectedMeal.id" />
        </div>

        <!-- Lista de comidas -->
        <div class="bg-white rounded-lg p-4 border border-gray-200">
          <h4 class="font-semibold text-emerald-700 mb-2">Alimentos adicionados</h4>
          <FoodList :mealId="selectedMeal.id" />
        </div>
      </div>
    </template>
  </Dialog>
</template>
