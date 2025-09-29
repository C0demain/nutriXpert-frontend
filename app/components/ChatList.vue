<template>
  <div class="flex flex-col h-full w-full overflow-hidden">
    <!-- Header com botão Novo Chat -->
    <header class="flex justify-between items-center p-4 text-emerald-600 font-bold">
      <span>Conversas</span>
      <button
        @click="newChat"
        class="bg-emerald-600 text-white px-3 py-1 rounded-md hover:bg-emerald-700 transition text-sm font-semibold"
      >
        + Novo Chat
      </button>
    </header>

    <!-- Lista de conversas -->
    <main class="flex-1 p-4 space-y-2 overflow-y-auto bg-gray-50">
      <div
        v-for="chat in chats"
        :key="chat.session_id"
        @click="selectChat(chat.session_id, chat.first_message)"
        class="p-3 rounded-lg border cursor-pointer hover:bg-emerald-50 transition
               flex justify-between items-center
               bg-white shadow-sm"
      >
        <span class="text-gray-800 truncate">{{ chat.first_message }}</span>
        <span class="text-xs text-gray-400">{{ chat.session_id.slice(0, 6) }}</span>
      </div>
      <div v-if="chats.length === 0" class="text-gray-400 text-center mt-4">
        Nenhuma conversa encontrada
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAgentAPI } from '~/composables/useAgentAPI'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '~/stores/auth'
import { useChatStore } from '~/stores/chat'

interface Chat {
  session_id: string;
  first_message: string;
}

type GetChatsResponse = Chat[]

const toast = useToast()
const authStore = useAuthStore()
const chatStore = useChatStore()
const chats = ref<Chat[]>([])

function selectChat(id: string, firstMessage: string) {
  chatStore.selectChat(id, firstMessage)
}

function newChat() {
  chatStore.selectChat('', '') // limpa a conversa selecionada
}

async function getChats(id?: string) {
  if (!id) return // não redireciona aqui, apenas não busca

  const { data, error } = await useAgentAPI<GetChatsResponse>(`/${id}/list`, {
    method: 'GET'
  })

  if (error.value) {
    toast.add({
      summary: 'Falha ao carregar conversas',
      detail: 'Algo deu errado, recarregue a página',
      severity: 'error',
      life: 4000
    })
  } else if (data.value) {
    chats.value = data.value
  }
}

// observa quando o userId fica disponível
watch(
  () => authStore.userId,
  (id) => {
    if (id) {
      getChats(id)
    }
  },
  { immediate: true }
)

// observa criação de novo chat
watch(
  () => chatStore.selectedChatId,
  (newId, oldId) => {
    if (newId && !oldId) {
      getChats(authStore.userId ?? undefined)
    }
  }
)
</script>
