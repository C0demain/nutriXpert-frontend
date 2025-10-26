<script setup lang="ts">
import { goalTypeOpts } from '~/types/Goal'

const visible = defineModel<boolean>('visible')

const toast = useToast()
const authStore = useAuthStore()

const description = ref('')
const targetWeight = ref(0)
const targetCalories = ref(0)
const goalType = ref('')

async function handleSubmit() {
  // 🧩 Validações básicas
  if (!goalType.value) {
    toast.add({
      severity: 'warn',
      summary: 'Campo obrigatório',
      detail: 'Selecione um objetivo antes de continuar.',
      life: 3000
    })
    return
  }

  if (!description.value || description.value.trim().length < 5) {
    toast.add({
      severity: 'warn',
      summary: 'Campo obrigatório',
      detail: 'A descrição deve ter pelo menos 5 caracteres.',
      life: 3000
    })
    return
  }

  if (targetWeight.value <= 0) {
    toast.add({
      severity: 'warn',
      summary: 'Valor inválido',
      detail: 'Informe uma meta de peso válida (maior que 0).',
      life: 3000
    })
    return
  }

  if (targetCalories.value <= 0) {
    toast.add({
      severity: 'warn',
      summary: 'Valor inválido',
      detail: 'Informe uma meta de calorias válida (maior que 0).',
      life: 3000
    })
    return
  }

  // 🚀 Envia dados à API
  const { error } = await useAPI('/goals', {
    method: 'post',
    body: {
      userId: authStore.userId,
      description: description.value.trim(),
      goalType: goalType.value,
      targetWeight: targetWeight.value,
      targetCalories: targetCalories.value,
      foodRestrictions: ''
    }
  })

  if (error.value) {
    const message =
      error.value.statusCode === 400
        ? 'Verifique os dados informados e tente novamente.'
        : 'Ocorreu um erro no servidor. Tente novamente mais tarde.'

    toast.add({
      severity: 'error',
      summary: 'Erro ao enviar objetivo',
      detail: message,
      life: 4000
    })
  } else {
    toast.add({
      severity: 'success',
      summary: 'Sucesso!',
      detail: 'Objetivo criado com sucesso.',
      life: 3000
    })

    visible.value = false
    await refreshNuxtData(['user-goals'])

    // Limpa os campos
    description.value = ''
    targetWeight.value = 0
    targetCalories.value = 0
    goalType.value = ''
  }
}
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Novo objetivo" :style="{ width: '35rem' }">
    <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-2">
        <label for="goalType">Objetivo <span class="text-red-500">*</span></label>
        <Select
          v-model="goalType"
          :options="goalTypeOpts"
          option-label="label"
          option-value="value"
          placeholder="Selecione um objetivo"
          id="goalType"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="description">Descrição <span class="text-red-500">*</span></label>
        <InputText
          v-model="description"
          id="description"
          placeholder="Ex: Quero perder 5kg em 2 meses"
        />
      </div>

      <div class="flex gap-6">
        <div class="flex flex-col gap-2 w-1/2">
          <label for="targetWeight">Meta de peso <span class="text-red-500">*</span></label>
          <InputGroup>
            <InputNumber v-model="targetWeight" id="targetWeight" placeholder="Ex: 70" />
            <InputGroupAddon>Kg</InputGroupAddon>
          </InputGroup>
        </div>

        <div class="flex flex-col gap-2 w-1/2">
          <label for="targetCalories">Meta de calorias <span class="text-red-500">*</span></label>
          <InputGroup>
            <InputNumber v-model="targetCalories" id="targetCalories" placeholder="Ex: 2000" />
            <InputGroupAddon>Kcal</InputGroupAddon>
          </InputGroup>
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
