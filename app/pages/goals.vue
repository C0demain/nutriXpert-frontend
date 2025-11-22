<script setup lang="ts">
import type { Goal, GoalProgress } from "~/types/Goal";

const authStore = useAuthStore();
const toast = useToast();
const isModalVisible = ref(false);

const {
  data: goals,
  error,
  pending,
} = await useAPI<GoalProgress[]>(`/goals/progress/user/${authStore.userId}`, {
  key: "user-goals",
});

if (error.value) {
  toast.add({
    summary: "Erro",
    detail:
      "Não foi possível carregar seus objetivos nutricionais. Tente novamente mais tarde",
    severity: "error",
    life: 3000,
  });
}

function getActiveMetrics(goal: GoalProgress) {
  const metrics = [
    {
      label: "Peso",
      currentValue: goal.currentWeight,
      targetValue: goal.targetWeight,
      progress: goal.weightProgress,
      unit: "Kg",
      key: "weight",
    },
    {
      label: "Calorias",
      currentValue: goal.currentCalories,
      targetValue: goal.targetCalories,
      progress: goal.caloriesProgressPercentage,
      unit: "Kcal",
      key: "calories",
    },
    {
      label: "Proteínas",
      currentValue: goal.currentProtein,
      targetValue: goal.targetProtein,
      progress: goal.proteinProgressPercentage,
      unit: "g",
      key: "protein",
    },
    {
      label: "Carboidratos",
      currentValue: goal.currentCarbs,
      targetValue: goal.targetCarbs,
      progress: goal.carbsProgressPercentage,
      unit: "g",
      key: "carbs",
    },
    {
      label: "Gorduras",
      currentValue: goal.currentFats,
      targetValue: goal.targetFats,
      progress: goal.fatsProgressPercentage,
      unit: "g",
      key: "fats",
    },
  ];

  return metrics.filter((metric) => (metric.targetValue ?? 0) > 0);
}

async function refresh() {
  await refreshNuxtData(["user-goals"]);
}

async function deleteGoal(id: number) {
  const { error } = await useAPI(`/goals/${id}`, { method: "DELETE" });

  if (error.value) {
    toast.add({
      summary: "Erro",
      detail: "Não foi possível excluir o objetivo. Tente novamente mais tarde",
      severity: "error",
      life: 3000,
    });
  } else {
    toast.add({
      summary: "Sucesso",
      detail: "Objetivo excluído com sucesso",
      severity: "success",
      life: 3000,
    });
    await refresh();
  }
}
</script>

<template>
  <h1 class="page-title">Objetivos nutricionais</h1>

  <NewGoalModal v-model:visible="isModalVisible" />

  <Button
    class="my-6 px-6 py-2 bg-emerald-500 text-white hover:bg-emerald-600 transition rounded-md shadow-md"
    icon="pi pi-plus"
    label="Novo objetivo"
    @click="isModalVisible = true"
  />

  <ProgressSpinner v-if="pending" />

  <div
    v-else-if="goals && goals.length === 0"
    class="text-center text-gray-500 mt-8"
  >
    <p class="text-lg">Você ainda não tem objetivos cadastrados.</p>
    <p class="text-sm mt-2">Clique em "Novo objetivo" para começar!</p>
  </div>

  <div class="grid grid-cols-2 gap-6" v-else>
    <Panel class="w-full flex" v-for="goal in goals" :key="goal.id">
      <template #header>
        <div class="flex items-center gap-2">
          <span class="text-lg font-bold">{{ goal.description }}</span>
        </div>
      </template>
      <template #icons>
        <div class="flex flex-wrap items-center justify-end">
          <span class="text-gray-500"
            >Termina em: {{ new Date(goal.endDate).toLocaleDateString() }}</span
          >
        </div>
      </template>
      <div class="flex flex-wrap gap-6 w-full">
        <div
          v-for="metric in getActiveMetrics(goal)"
          :key="metric.key"
          class="flex flex-col items-center"
          :class="
            getActiveMetrics(goal).length === 1
              ? 'w-full'
              : 'flex-1 min-w-[120px]'
          "
        >
          <p class="text-md text-gray-600 mb-2 text-center wrap-normal">
            {{ metric.label }}
          </p>
          <div class="flex items-baseline gap-1">
            <p class="text-5xl font-semibold text-emerald-600">
              {{ metric.targetValue }}
            </p>
            <span class="text-lg text-gray-500">{{ metric.unit }}</span>
          </div>
          <div>
            <span v-if="metric.key == 'weight'" class="text-lg text-gray-500"
              >{{ metric.progress }}{{ metric.unit }} para a meta</span
            >
            <span v-else class="text-lg text-gray-500"
              >{{ metric.progress.toFixed(2) }}%</span
            >
          </div>
        </div>
      </div>
      <template #footer>
        <div class="w-full flex justify-between items-center">
          <Badge class="mt-auto">{{ goal.goalType.toUpperCase() }}</Badge>
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            rounded
            @click="deleteGoal(goal.id)"
          />
        </div>
      </template>
    </Panel>
  </div>
</template>
