<template>
    <h1 class="page-title">Usuários</h1>
    <DataTable :value="users" v-if="!error" v-model:filters="filters" data-key="id" :loading="pending" :global-filter-fields="['name', 'email']" scrollable scroll-height="320px">
        <template #header>
            <div class="flex gap-4">
                <InputText v-model="filters['global'].value" placeholder="Procurar por nome ou email" fluid/>
                <Button @click="() => refresh()">Atualizar</Button>
            </div>
        </template>
        <Column field="id" header="Id" sortable></Column>
        <Column field="name" header="Nome" sortable></Column>
        <Column field="email" header="Email"></Column>
        <Column header="Ações" field="id">
            <template #body = {data}>
                <NuxtLink :href="`/admin/users/${data.id}/chat`" class="hover:text-primary">
                    <i class="pi pi-comments"></i>
                    Conversas
                </NuxtLink>
            </template>
        </Column>
    </DataTable>
</template>

<script lang="ts" setup>
import type { User } from '~/types/User';
import { FilterMatchMode } from '@primevue/core/api';

const {data: users, error, refresh, pending} = useAPI<User[]>('/user')
const filters = ref({
    global: {value: null, matchMode: FilterMatchMode.CONTAINS}
})
</script>