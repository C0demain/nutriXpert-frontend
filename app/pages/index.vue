<template @render>
    <div class="h-[calc(100vh-20rem)] mx-auto flex flex-col justify-center items-center">
        <img src="~/assets/img/logotipo.png" class="w-fit"/>
        <p class="text-2xl">Sua assistente IA nutricional</p>
        <p class="text-lg mb-6">Clique em Criar conta para começar</p>
        <div class="flex w-fit gap-12 justify-between">
            <NuxtLink to="/login" class="p-4 bg-neutral-100 text-xl rounded-lg font-bold">Entrar</NuxtLink>
            <NuxtLink to="/register" class="p-4 bg-primary text-white text-xl rounded-lg font-bold whitespace-nowrap">Criar conta</NuxtLink>
        </div>
    </div>
</template>
