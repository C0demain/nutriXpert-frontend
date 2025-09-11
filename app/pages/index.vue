<script lang="ts" setup>
import { Button } from 'primevue';
</script>

<template @render>
    <h1 class="page-title">Home</h1>
    <p>Essa é a pagina Home</p>
    <Button class="mt-4" @click="console.log('Esse botão é do PrimeVue')" label="Clique aqui"></Button>
</template>
