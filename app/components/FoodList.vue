<script setup lang="ts">
import type { Food } from '~/types/Food';

const { mealId } = defineProps({ mealId: { required: true, type: Number } })
const toast = useToast()

const { data: foods, error, refresh } = await useAPI<Food[]>(`/foods/meal/${mealId}`, { key: `${mealId}:foods` })

async function deleteFood(mealId: number) {
    const { error } = await useAPI(`/foods/${mealId}`, { method: 'delete' })
    if (error.value) {
        toast.add({
            summary: "Erro",
            detail: "Não foi possível excluir essa comida. Tente novamente mais tarde",
            severity: 'error',
            life: 2500
        })
        return
    }

    toast.add({
        summary: 'Sucesso',
        detail: 'Comida excluída com sucesso',
        severity: 'success',
        life: 2500
    })

    await refresh()
}
</script>

<template>
    <DataTable :value="foods" v-if="!error && foods && foods.length > 0">
        <Column field="foodName" header="Nome"></Column>
        <Column field="calories" header="Kcal"></Column>
        <Column field="protein" header="Proteínas"></Column>
        <Column field="carbohydrates" header="Carboidratos"></Column>
        <Column field="fat" header="Gordura"></Column>
        <Column field="id">
            <template #body="{ data }">
                <Button @click="async () => await deleteFood(data.id)" variant="outlined" severity="danger"
                    icon="pi pi-trash" />
            </template>
        </Column>
    </DataTable>
    <div class="mx-auto my-4 w-fit text-center space-y-4" v-if="error">
        <h1 class="text-center">Não foi possível carregar os alimentos dessa refeição</h1>
        <Button label="Recarregar" icon="pi pi-refresh" variant="outlined" @click="async () => await refresh()" />
    </div>
    <div class="mx-auto my-4 w-fit text-center space-y-4" v-if="foods?.length === 0">
        <h1 class="text-center">Nenhuma comida adicionada</h1>
        <Button label="Recarregar" icon="pi pi-refresh" variant="outlined" @click="async () => await refresh()" />
    </div>
</template>