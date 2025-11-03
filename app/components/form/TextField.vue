<script setup lang="ts">
interface TextFieldProps{
    id?: string
    label?: string
    placeholder?: string
    required?: (boolean | 'true' | 'false') | undefined
}

defineProps<TextFieldProps>()
const model = defineModel<string>()
</script>

<template>
    <div class="flex flex-col gap-2">
        <label :for="id">{{ label }}</label>
        <InputText :id v-model="model" :placeholder :required/>
    </div>
</template>