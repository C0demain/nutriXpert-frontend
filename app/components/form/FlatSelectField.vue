<script setup lang="ts">
interface FlatSelectFieldProps{
    id?: string
    label?: string
    placeholder?: string
    options?: any[]
    optionLabel?: string
    optionValue?: string
}

defineProps<FlatSelectFieldProps>()
const model = defineModel()
</script>

<template>
    <div class="flex flex-col gap-2">
        <label :for="id">{{ label }}</label>
        <SelectButton :options :id v-model="model" :option-label :option-value :placeholder/>
    </div>
</template>