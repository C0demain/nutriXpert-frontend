<script setup lang="ts">
interface RadioFieldProps{
    id?: string
    label?: string
    options?: string[]
}

defineProps<RadioFieldProps>()
const model = defineModel<string>()
</script>

<template>
    <div class="flex flex-col gap-2">
        <label>{{ label }}</label>
        <div class="space-x-2" v-for="item in options">
            <RadioButton v-model="model" :value="item" :id/>
            <label :for="item">{{ item }}</label>
        </div>
    </div>
</template>