<script setup lang="ts">
import { goalTypeOpts, metricTypes, type GoalTypeOps } from "~/types/Goal";

const visible = defineModel<boolean>("visible");

const toast = useToast();
const authStore = useAuthStore();

const description = ref("");
const goalType = ref<GoalTypeOps | null>(null);
const startDate = ref<Date>(new Date());
const endDate = ref<Date | null>(null);

// Metas selecionadas pelo usuário
const selectedMetrics = ref<
  Array<{
    name: string;
    label: string;
    unit: string;
    key: string;
    value: number;
  }>
>([]);

// Menu para adicionar novas metas
const menu = ref();
const toggleMenu = (event: Event) => {
  menu.value.toggle(event);
};

// Adiciona uma nova meta
function addMetric(metricValue: string) {
  const metric = metricTypes.find((m) => m.name === metricValue);
  if (metric && !selectedMetrics.value.some((m) => m.name === metric.name)) {
    selectedMetrics.value.push({
      name: metric.name,
      label: metric.label,
      unit: metric.unit,
      key: metric.key,
      value: 0,
    });
  }
}

function removeMetric(index: number) {
  selectedMetrics.value.splice(index, 1);
}

const availableMetrics = computed(() => {
  return metricTypes
    .filter(
      (metric) => !selectedMetrics.value.some((m) => m.name === metric.name)
    )
    .map((metric) => ({
      label: metric.label,
      command: () => addMetric(metric.name),
    }));
});

async function handleSubmit() {
  // Validações básicas
  if (!goalType.value) {
    toast.add({
      severity: "warn",
      summary: "Campo obrigatório",
      detail: "Selecione um objetivo antes de continuar.",
      life: 3000,
    });
    return;
  }

  if (!description.value || description.value.trim().length < 5) {
    toast.add({
      severity: "warn",
      summary: "Campo obrigatório",
      detail: "A descrição deve ter pelo menos 5 caracteres.",
      life: 3000,
    });
    return;
  }

  if (selectedMetrics.value.length === 0) {
    toast.add({
      severity: "warn",
      summary: "Campo obrigatório",
      detail: "Adicione pelo menos uma meta.",
      life: 3000,
    });
    return;
  }

  if (!startDate.value) {
    toast.add({
      severity: "warn",
      summary: "Campo obrigatório",
      detail: "Selecione uma date de início antes de continuar.",
      life: 3000,
    });
    return;
  }
  if (!endDate.value) {
    toast.add({
      severity: "warn",
      summary: "Campo obrigatório",
      detail: "Selecione uma date de término antes de continuar.",
      life: 3000,
    });
    return;
  }

  if (startDate.value > endDate.value) {
    toast.add({
      severity: "warn",
      summary: "Formato inválido",
      detail: "Data de início não pode ser maior do que data de término.",
      life: 3000,
    });
    return;
  }

  // Valida se todas as metas têm valores válidos
  const invalidMetrics = selectedMetrics.value.filter((m) => m.value <= 0);
  if (invalidMetrics.length > 0) {
    toast.add({
      severity: "warn",
      summary: "Valores inválidos",
      detail: `Informe valores maiores que 0 para todas as metas.`,
      life: 3000,
    });
    return;
  }

  const body: any = {
    userId: authStore.userId,
    description: description.value.trim(),
    goalType: goalType.value,
    targetWeight: 0,
    targetCalories: 0,
    targetProtein: 0,
    targetCarbs: 0,
    targetFats: 0,
    foodRestrictions: "",
    startDate: startDate.value,
    endDate: endDate.value,
  };

  // Preenche apenas as metas selecionadas
  selectedMetrics.value.forEach((metric) => {
    body[metric.key] = metric.value;
  });

  // Envia dados à API
  const { error } = await useAPI("/goals", {
    method: "post",
    body,
  });

  if (error.value) {
    const message =
      error.value.statusCode === 400
        ? "Verifique os dados informados e tente novamente."
        : "Ocorreu um erro no servidor. Tente novamente mais tarde.";

    toast.add({
      severity: "error",
      summary: "Erro ao enviar objetivo",
      detail: message,
      life: 4000,
    });
  } else {
    toast.add({
      severity: "success",
      summary: "Sucesso!",
      detail: "Objetivo criado com sucesso.",
      life: 3000,
    });

    visible.value = false;
    await refreshNuxtData(["user-goals"]);

    // Limpa os campos
    description.value = "";
    goalType.value = null;
    selectedMetrics.value = [];
    startDate.value = new Date();
    endDate.value = null;
  }
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Novo objetivo"
    :style="{ width: '35rem' }"
  >
    <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-2">
        <label for="goalType">
          Objetivo: <span class="text-red-500">*</span>
        </label>
        <Select
          v-model="goalType"
          :options="[...goalTypeOpts]"
          option-label="label"
          option-value="value"
          placeholder="Selecione um objetivo"
          id="goalType"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="description">
          Descrição: <span class="text-red-500">*</span>
        </label>
        <InputText
          v-model="description"
          id="description"
          placeholder="Ex: Quero perder 5kg em 2 meses"
        />
      </div>

      <div class="flex flex-row gap-2">
        <div class="flex flex-col flex-1 gap-2">
          <label for="startDate">
            Início: <span class="text-red-500">*</span>
          </label>
          <DatePicker
            v-model="startDate"
            id="starDate"
            placeholder="Data de Início"
            date-format="dd/mm/yy"
            fluid
            showIcon
            iconDisplay="input"
          >
          </DatePicker>
        </div>
        <div class="flex flex-col flex-1 gap-2">
          <label for="endDate">
            Fim: <span class="text-red-500">*</span>
          </label>
          <DatePicker
            v-model="endDate"
            id="endDate"
            placeholder="Data de Término"
            date-format="dd/mm/yy"
            fluid
            showIcon
            iconDisplay="input"
            :min-date="startDate"
          />
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <label class="font-medium">
            Metas: <span class="text-red-500">*</span>
          </label>
          <Button
            type="button"
            size="small"
            outlined
            icon="pi pi-plus"
            label="Adicionar meta"
            @click="toggleMenu"
            :disabled="availableMetrics.length === 0"
          />
          <Menu ref="menu" :model="availableMetrics" popup />
        </div>

        <div v-if="selectedMetrics.length === 0" class="text-gray-500 text-sm">
          Nenhuma meta adicionada. Clique em "Adicionar meta" para começar.
        </div>

        <div v-else class="flex flex-col gap-3">
          <div
            v-for="(metric, index) in selectedMetrics"
            :key="metric.name"
            class="flex items-center gap-3"
          >
            <div class="flex-1">
              <label :for="`metric-${index}`" class="text-sm mb-1 block">
                {{ metric.label }}
              </label>
              <InputGroup>
                <InputNumber
                  v-model="metric.value"
                  :id="`metric-${index}`"
                  :placeholder="`Ex: ${
                    metric.name === 'weight' ? '70' : '2000'
                  }`"
                />
                <InputGroupAddon>{{ metric.unit }}</InputGroupAddon>
              </InputGroup>
            </div>
            <Button
              type="button"
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              @click="removeMetric(index)"
              class="mt-6"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-4">
        <Button
          type="button"
          variant="outlined"
          class="px-4 py-2 text-gray-700 border-gray-300 hover:bg-gray-100 rounded-md transition-all"
          @click="visible = false"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          class="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md shadow-sm transition-all"
        >
          Criar
        </Button>
      </div>
    </form>
  </Dialog>
</template>
