<template @render>
  <div class="min-h-screen flex flex-col justify-center items-center text-center bg-[url(~/assets/img/waves.svg)] bg-cover bg-center bg-no-repeat bg-fixed">
    <img src="~/assets/img/logotipo.png" alt="Logotipo" class="max-w-xs md:max-w-md mx-auto drop-shadow-lg" />

    <p class="text-2xl font-semibold">Sua assistente IA nutricional</p>
    <p class="text-lg mb-8 text-gray-600">Clique em Criar conta para começar</p>

    <div class="flex gap-8">
      <NuxtLink 
        to="/login" 
        class="p-4 bg-neutral-100 text-xl rounded-lg font-bold shadow-md hover:shadow-lg transition-shadow duration-200">
        Entrar
      </NuxtLink>
      
      <NuxtLink 
        to="/register" 
        class="p-4 bg-primary text-white text-xl rounded-lg font-bold shadow-md hover:shadow-lg transition-shadow duration-200">
        Criar conta
      </NuxtLink>
    </div>
  </div>
</template>
