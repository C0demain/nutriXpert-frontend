<script setup lang="ts">

const visible = defineModel<boolean>("visible")

const toast = useToast()
const authStore = useAuthStore()

const description = ref("")
const targetWeight = ref(0)
const targetCalories = ref(0)
const goalType = ref(0)
const goalTypeOpts = [
    { label: "Perda de peso", value: "WEIGHT_LOSS" },
    { label: "Ganho de peso", value: "WEIGHT_GAIN" },
    { label: "Ganho de massa", value: "MUSCLE_GAIN" },
    { label: "Perda de gordura", value: "FAT_LOSS" },
    { label: "Manutenção do peso", value: "MAINTENANCE" }
]

async function handleSubmit() {
    const { error } = await useAPI('/goals', {
        method: 'post',
        body: {
            userId: authStore.userId,
            description: description.value,
            goalType: goalType.value,
            targetWeight: targetWeight.value,
            targetCalories: targetCalories.value,
            foodRestrictions: ""
        }
    })

    if (error.value) {
        switch (error.value.statusCode) {
            case 500:
                toast.add({
                    severity: 'error',
                    summary: 'Erro ao enviar',
                    detail: 'Algo deu errado. Tente novamente',
                    life: 3000,
                })
            case 400:
                toast.add({
                    severity: 'error',
                    summary: 'Erro ao enviar',
                    detail: 'Algo deu errado. Tente novamente',
                    life: 3000,
                })
        }
    } else {
        toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Objetivo criado com sucesso',
            life: 3000,
        })
        visible.value = false
        await refreshNuxtData(['user-goals'])
        description.value = ""
        targetWeight.value = 0
        targetCalories.value = 0
        goalType.value = 0
    }

}

</script>

<template>
    <Dialog v-model:visible="visible" modal header="Novo objetivo">
        <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-2">
                <label for="goalType">Objetivo</label>
                <Select v-model="goalType" :options="goalTypeOpts" option-label="label" option-value="value" placeholder="Selecione um objetivo"
                    id="goalType" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="description">Descrição</label>
                <InputText v-model="description" id="description" placeholder="Ex: Quero perder 5kg em 2 meses" />
            </div>
            <div class="flex gap-6">
                <div class="flex flex-col gap-2">
                    <label for="targetWeight">Meta de peso</label>
                    <InputGroup>
                        <InputNumber v-model="targetWeight" id="targetWeight" placeholder="Ex: 70kg" />
                        <InputGroupAddon>Kg</InputGroupAddon>
                    </InputGroup>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="targetCalories">Meta de calorias</label>
                    <InputGroup>
                        <InputNumber v-model="targetCalories" id="targetCalories" placeholder="Ex: 2000kcal" />
                        <InputGroupAddon>Kcal</InputGroupAddon>
                    </InputGroup>
                </div>
            </div>

            <div class="w-full flex gap-4">
                <Button variant="outlined" class="flex-1" @click="visible = false">Cancelar</Button>
                <Button type="submit" class="flex-2">Criar</Button>
            </div>
        </form>
    </Dialog>
</template>