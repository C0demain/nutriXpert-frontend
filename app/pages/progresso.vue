<script setup lang="ts">
import type { WeeklyReport } from '~/types/WeeklyReport'

const authStore = useAuthStore()
const toast = useToast()

const { data: weeklyReport, error, pending, refresh } = await useAPI<WeeklyReport>(
  `/reports/weekly/current?userId=${authStore.userId}`,
  { key: 'weekly-report' }
)

if (error.value) {
  const backendMessage = (error.value as any).data?.message || (error.value as any).cause?.data?.message
  const errorDetail = backendMessage || error.value.message || 'Não foi possível carregar o relatório semanal.'
  
  toast.add({
    summary: "Erro ao carregar relatório",
    detail: errorDetail,
    severity: 'error',
    life: 7000
  })
}

const formatDate = (dateInput: string | {year: number, month: number, day: number}) => {
  let date: Date
  
  if (typeof dateInput === 'string') {
    date = new Date(dateInput)
  } else {
    date = new Date(dateInput.year, dateInput.month - 1, dateInput.day)
  }
  
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

const formatDateRange = (start: string | {year: number, month: number, day: number}, end: string | {year: number, month: number, day: number}) => {
  return `${formatDate(start)} - ${formatDate(end)}`
}

const getDayName = (dateInput: string | {year: number, month: number, day: number}) => {
  let date: Date
  
  if (typeof dateInput === 'string') {
    date = new Date(dateInput)
  } else {
    date = new Date(dateInput.year, dateInput.month - 1, dateInput.day)
  }
  
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  return days[date.getDay()]
}

const isToday = (dateInput: string | {year: number, month: number, day: number}) => {
  let date: Date
  
  if (typeof dateInput === 'string') {
    date = new Date(dateInput)
  } else {
    date = new Date(dateInput.year, dateInput.month - 1, dateInput.day)
  }
  
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
  
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Relatório Semanal</h1>
          <p v-if="weeklyReport" class="text-gray-600 mt-1">
            {{ formatDateRange(weeklyReport.weekStart, weeklyReport.weekEnd) }}
          </p>
        </div>
        <div class="flex gap-3">
          <Button
            icon="pi pi-refresh"
            label="Atualizar"
            severity="secondary"
            @click="() => refresh()"
          />
          <Button
            icon="pi pi-arrow-left"
            label="Voltar"
            severity="secondary"
            @click="$router.push('/goals')"
          />
        </div>
      </div>

      <ProgressSpinner v-if="pending" class="flex justify-center mt-12" />

      <div v-else-if="!weeklyReport" class="text-center py-16 bg-white rounded-lg shadow">
        <i class="pi pi-chart-bar text-6xl text-gray-300 mb-4"></i>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Nenhum dado encontrado</h2>
        <p class="text-gray-500 mb-4">Registre suas refeições para acompanhar seu progresso</p>
        
        <div v-if="error" class="mt-6">
          <p class="text-sm text-red-600 mb-4">{{ (error as any).cause?.data?.message || 'Erro ao carregar dados' }}</p>
          <div class="flex gap-3 justify-center flex-wrap">
            <Button
              icon="pi pi-refresh"
              label="Atualizar"
              @click="() => refresh()"
            />
            <Button
              icon="pi pi-utensils"
              label="Registrar Refeição"
              severity="success"
              @click="() => $router.push('/refeicoes')"
            />
          </div>
        </div>
      </div>

      <div v-else class="space-y-6">
     
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-6">📊 Resumo da Semana</h2>
          
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div class="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p class="text-sm text-gray-600 mb-1">🔥 Calorias</p>
              <p class="text-2xl font-bold text-orange-600">
                {{ Math.round(weeklyReport.nutrientSummary.totalCalories) }}
              </p>
            
            </div>

            <div class="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <p class="text-sm text-gray-600 mb-1">🥩 Proteínas</p>
              <p class="text-2xl font-bold text-red-600">
                {{ Math.round(weeklyReport.nutrientSummary.totalProtein) }}g
              </p>
             
            </div>

            <div class="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p class="text-sm text-gray-600 mb-1">🍞 Carboidratos</p>
              <p class="text-2xl font-bold text-yellow-600">
                {{ Math.round(weeklyReport.nutrientSummary.totalCarbs) }}g
              </p>
             
            </div>

            <div class="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p class="text-sm text-gray-600 mb-1">🥑 Gorduras</p>
              <p class="text-2xl font-bold text-green-600">
                {{ Math.round(weeklyReport.nutrientSummary.totalFat) }}g
              </p>
             
            </div>

            <div class="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p class="text-sm text-gray-600 mb-1">🍽️ Refeições</p>
              <p class="text-2xl font-bold text-blue-600">
                {{ weeklyReport.nutrientSummary.totalMeals }}
              </p>
             
            </div>
          </div>
        </div>

   
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">📋 Detalhamento Diário</h2>
          
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold text-gray-700">Dia</th>
                  <th class="px-4 py-3 text-right font-semibold text-gray-700">Calorias</th>
                  <th class="px-4 py-3 text-right font-semibold text-gray-700">Proteínas</th>
                  <th class="px-4 py-3 text-right font-semibold text-gray-700">Carboidratos</th>
                  <th class="px-4 py-3 text-right font-semibold text-gray-700">Gorduras</th>
                  <th class="px-4 py-3 text-right font-semibold text-gray-700">Refeições</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="(day, index) in weeklyReport.dailySummaries"
                  :key="`day-${index}`"
                  :class="[
                    isToday(day.date) ? 'bg-emerald-50 font-semibold' : 'hover:bg-gray-50'
                  ]"
                >
                  <td class="px-4 py-3">
                    {{ getDayName(day.date) }} {{ formatDate(day.date) }}
                    <span v-if="isToday(day.date)" class="ml-2 text-xs text-emerald-600">(Hoje)</span>
                  </td>
                  <td class="px-4 py-3 text-right">{{ Math.round(day.totalCalories) }} kcal</td>
                  <td class="px-4 py-3 text-right">{{ Math.round(day.totalProtein) }}g</td>
                  <td class="px-4 py-3 text-right">{{ Math.round(day.totalCarbs) }}g</td>
                  <td class="px-4 py-3 text-right">{{ Math.round(day.totalFat) }}g</td>
                  <td class="px-4 py-3 text-right">{{ day.totalMeals }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
