<script setup lang="ts">
const { mealId } = defineProps({ mealId: { required: true, type: Number } })
const toast = useToast()

const foodName = ref('')
const calories = ref(0)
const protein = ref(0)
const carbohydrates = ref(0)
const fat = ref(0)
const isSubmitting = ref(false)

async function handleSubmit() {
  // 🔹 Evita múltiplos envios
  if (isSubmitting.value) return

  // 🔸 Validação: nome obrigatório
  if (!foodName.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'Campo obrigatório',
      detail: 'O nome do alimento não pode estar vazio.',
      life: 3000
    })
    return
  }

  isSubmitting.value = true

  const { error } = await useAPI('/foods', {
    method: 'post',
    body: {
      mealId,
      foodName: foodName.value.trim(),
      calories: calories.value,
      protein: protein.value,
      carbohydrates: carbohydrates.value,
      fat: fat.value
    }
  })

  if (error.value) {
    toast.add({
      severity: 'error',
      summary: 'Erro ao adicionar comida',
      detail: 'Algo deu errado. Tente novamente.',
      life: 2500
    })
  } else {
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Comida registrada com sucesso!',
      life: 2500
    })
    await refreshNuxtData(`${mealId}:foods`)

    // 🔹 Limpa os campos
    foodName.value = ''
    calories.value = 0
    protein.value = 0
    carbohydrates.value = 0
    fat.value = 0
  }

  isSubmitting.value = false
}
</script>

<template>
  <form
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-end"
    @submit.prevent="handleSubmit"
  >
    <!-- Nome -->
    <div class="flex flex-col gap-2 ">
      <label for="foodName" class="font-medium text-gray-700">
        Nome do alimento <span class="text-red-500">*</span>
      </label>
      <InputText
        v-model="foodName"
        id="foodName"
        size="small"
        fluid
        placeholder="Ex: Peito de frango, Arroz integral..."
      />
    </div>

    <!-- Calorias -->
    <div class="flex flex-col gap-2">
      <label for="calories" class="font-medium text-gray-700">Calorias (Kcal)</label>
      <InputNumber
        v-model="calories"
        id="calories"
        size="small"
        fluid
        placeholder="Ex: 250 kcal"
      />
    </div>

    <!-- Proteínas -->
    <div class="flex flex-col gap-2">
      <label for="protein" class="font-medium text-gray-700">Proteínas (g)</label>
      <InputNumber
        v-model="protein"
        id="protein"
        size="small"
        fluid
        placeholder="Ex: 30 g"
      />
    </div>

    <!-- Carboidratos -->
    <div class="flex flex-col gap-2">
      <label for="carbohydrates" class="font-medium text-gray-700">Carboidratos (g)</label>
      <InputNumber
        v-model="carbohydrates"
        id="carbohydrates"
        size="small"
        fluid
        placeholder="Ex: 40 g"
      />
    </div>

    <!-- Gordura -->
    <div class="flex flex-col gap-2">
      <label for="fat" class="font-medium text-gray-700">Gordura (g)</label>
      <InputNumber
        v-model="fat"
        id="fat"
        size="small"
        fluid
        placeholder="Ex: 10 g"
      />
    </div>

    <!-- Botão -->
    <div class="md:col-span-2 lg:col-span-3 flex justify-end">
      <Button
        type="submit"
        class="bg-emerald-500 text-white hover:bg-emerald-600 transition-all px-6 py-2"
        size="small"
        :disabled="isSubmitting"
        :loading="isSubmitting"
      >
        Adicionar comida
      </Button>
    </div>
  </form>
</template>
