<script setup lang="ts">
interface SelectFieldProps{
    id?: string
    label?: string
    placeholder?: string
    options?: any[]
    optionLabel?: string
    optionValue?: string
}

defineProps<SelectFieldProps>()
const model = defineModel()
</script>

<template>
    <div class="flex flex-col gap-2">
        <label :for="id">{{ label }}</label>
        <Select :options :id v-model="model" :option-label :option-value :placeholder />
    </div>
</template>