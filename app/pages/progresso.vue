<script setup lang="ts">
import type { GoalProgress } from '~/types/Goal'

const authStore = useAuthStore()
const toast = useToast()

const { data: progressData, error, pending } = await useAPI<GoalProgress[]>(
  `/goals/progress/user/${authStore.userId}`,
  { key: 'user-goals-progress' }
)

if (error.value) {
  toast.add({
    summary: "Erro",
    detail: "Não foi possível carregar o progresso das suas metas.",
    severity: 'error',
    life: 3000
  })
}

const getProgressColor = (progress: number) => {
  if (progress >= 80) return 'bg-green-500'
  if (progress >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getProgressTextColor = (progress: number) => {
  if (progress >= 80) return 'text-green-600'
  if (progress >= 50) return 'text-yellow-600'
  return 'text-red-600'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Progresso das Metas</h1>
        <Button
          icon="pi pi-arrow-left"
          label="Voltar"
          severity="secondary"
          @click="$router.push('/goals')"
        />
      </div>

      <ProgressSpinner v-if="pending" class="flex justify-center mt-12" />

      <div v-else-if="!progressData || progressData.length === 0" class="text-center py-16 bg-white rounded-lg shadow">
        <i class="pi pi-chart-bar text-6xl text-gray-300 mb-4"></i>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Nenhum objetivo encontrado</h2>
        <p class="text-gray-500 mb-6">Cadastre um objetivo para acompanhar seu progresso</p>
        <Button
          label="Cadastrar Objetivo"
          icon="pi pi-plus"
          @click="$router.push('/goals')"
        />
      </div>

      <div v-else class="space-y-4">
        <div v-for="goal in progressData" :key="goal.id" class="bg-white rounded-lg shadow-md overflow-hidden">
          <!-- Header do Card -->
          <div class="bg-emerald-600 text-white p-4">
            <h2 class="text-xl font-bold">{{ goal.description }}</h2>
            <span class="text-sm opacity-90">{{ goal.goalType }}</span>
          </div>

          <!-- Conteúdo -->
          <div class="p-6 space-y-6">
            <!-- Peso -->
            <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p class="text-sm text-gray-600 mb-1">⚖️ Peso Atual</p>
                <p class="text-2xl font-bold text-blue-700">{{ goal.currentWeight }} kg</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-600 mb-1">Meta</p>
                <p class="text-2xl font-bold text-gray-800">{{ goal.targetWeight }} kg</p>
              </div>
            </div>

            <!-- Macronutrientes -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Calorias -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">🔥 Calorias</span>
                  <span :class="getProgressTextColor(goal.caloriesProgress)" class="text-sm font-bold">
                    {{ Math.round(goal.caloriesProgress) }}%
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    :class="getProgressColor(goal.caloriesProgress)"
                    class="h-2.5 rounded-full transition-all"
                    :style="{ width: `${Math.min(goal.caloriesProgress, 100)}%` }"
                  ></div>
                </div>
                <div class="flex justify-between text-xs text-gray-600">
                  <span>{{ goal.currentCalories }} kcal</span>
                  <span>{{ goal.targetCalories }} kcal</span>
                </div>
              </div>

              <!-- Proteínas -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">🥩 Proteínas</span>
                  <span :class="getProgressTextColor(goal.proteinProgress)" class="text-sm font-bold">
                    {{ Math.round(goal.proteinProgress) }}%
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    :class="getProgressColor(goal.proteinProgress)"
                    class="h-2.5 rounded-full transition-all"
                    :style="{ width: `${Math.min(goal.proteinProgress, 100)}%` }"
                  ></div>
                </div>
                <div class="flex justify-between text-xs text-gray-600">
                  <span>{{ goal.currentProtein }} g</span>
                  <span>{{ goal.targetProtein }} g</span>
                </div>
              </div>

              <!-- Carboidratos -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">🍞 Carboidratos</span>
                  <span :class="getProgressTextColor(goal.carbsProgress)" class="text-sm font-bold">
                    {{ Math.round(goal.carbsProgress) }}%
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    :class="getProgressColor(goal.carbsProgress)"
                    class="h-2.5 rounded-full transition-all"
                    :style="{ width: `${Math.min(goal.carbsProgress, 100)}%` }"
                  ></div>
                </div>
                <div class="flex justify-between text-xs text-gray-600">
                  <span>{{ goal.currentCarbs }} g</span>
                  <span>{{ goal.targetCarbs }} g</span>
                </div>
              </div>

              <!-- Gorduras -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">🥑 Gorduras</span>
                  <span :class="getProgressTextColor(goal.fatsProgress)" class="text-sm font-bold">
                    {{ Math.round(goal.fatsProgress) }}%
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    :class="getProgressColor(goal.fatsProgress)"
                    class="h-2.5 rounded-full transition-all"
                    :style="{ width: `${Math.min(goal.fatsProgress, 100)}%` }"
                  ></div>
                </div>
                <div class="flex justify-between text-xs text-gray-600">
                  <span>{{ goal.currentFats }} g</span>
                  <span>{{ goal.targetFats }} g</span>
                </div>
              </div>
            </div>

            <!-- Status -->
            <div 
              v-if="goal.caloriesProgress >= 80 && goal.proteinProgress >= 80"
              class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm"
            >
              <i class="pi pi-check-circle"></i>
              <span class="font-medium">Excelente progresso! Continue assim.</span>
            </div>
            <div 
              v-else-if="goal.caloriesProgress >= 50"
              class="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm"
            >
              <i class="pi pi-info-circle"></i>
              <span class="font-medium">Bom progresso, mantenha o foco!</span>
            </div>
            <div 
              v-else
              class="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-sm"
            >
              <i class="pi pi-exclamation-circle"></i>
              <span class="font-medium">Continue se esforçando para alcançar suas metas.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
