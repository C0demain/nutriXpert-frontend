<script setup lang="ts">
interface TextFieldProps{
    id?: string
    label?: string
    activeLabel?: string
    inactiveLabel?: string
}

defineProps<TextFieldProps>()
const model = defineModel<boolean>()
</script>

<template>
    <div class="flex flex-col gap-2">
        <label :for="id">{{ label }}</label>
        <div class="flex gap-2">
            <label>{{ inactiveLabel }}</label>
            <ToggleSwitch :id v-model="model"/>
            <label>{{ activeLabel }}</label>
        </div>
    </div>
</template>