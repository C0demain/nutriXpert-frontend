<template>
  <div class="flex flex-col h-full w-full shadow-xl overflow-hidden bg-white">
    <!-- Header / Navbar -->
    <header class="p-4 font-bold text-white bg-emerald-600">
      Chat
    </header>

    <!-- Chat messages -->
    <main
      ref="chatWindow"
      class="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col"
    >
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="msg.author === 'user' ? 'items-end' : 'items-start'"
        class="flex flex-col"
      >
        <div
          :class="msg.author === 'user' 
            ? 'bg-emerald-500 text-white' 
            : 'bg-gray-200 text-gray-800'"
          class="px-3 py-2 rounded-md max-w-xs break-words"
        >
          {{ msg.text }}
        </div>
        <span class="text-xs text-gray-400 mt-1">
          {{ msg.timestamp }}
        </span>
      </div>
    </main>

    <!-- Input -->
    <form
      @submit.prevent="sendMessage"
      class="flex p-3 bg-gray-100 border-t border-gray-200"
    >
      <input
        v-model="newMessage"
        type="text"
        placeholder="Digite sua mensagem..."
        class="flex-1 border rounded-full px-3 py-2 mr-2 focus:outline-none focus:ring focus:ring-emerald-400 bg-white text-gray-800 placeholder-gray-400 text-sm"
      />
      <button
        type="submit"
        class="bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition text-sm"
      >
        Enviar
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"


export interface Message {
  id: string
  timestamp: number
  author: string
  role: string
  text: string
}

export interface ChatSession {
  app_name: string
  user_id: string
  session_id: string
  create_timestamp: string | null
  update_timestamp: string | null
  state: Record<string, any> // ou um tipo mais específico se você souber
  messages: Message[]
  events: any | null
}

const schema = z.string().uuid()
const toast = useToast()
const chatStore = useChatStore()
const authStore = useAuthStore()
const messages = ref<Message[]>([]);
const newMessage = ref("");
const chatWindow = ref<HTMLElement | null>(null);

watch(
  () => chatStore.selectedChatId,
  (newId) => {
    messages.value = [] // limpa sempre que muda o chat selecionado
    const userId = authStore.userId
    if (newId && userId) {
      getMessages(newId, userId)
    }
  },
  { immediate: true }
)

watchEffect(() => {
  // Isso força a atualização do header
  console.log(chatStore.selectedFirstMessage)
})

const getMessages = async (chatId:string, userId?: string) => {
  if(!userId){
    navigateTo('/login')
  }

  if(chatId.length > 0){
    const {data, error} = await useAgentAPI<ChatSession>(`/sessions/${userId}/${chatId}`, {
      method: 'GET'
    })

    console.log(data.value?.messages)
    if (error.value) {
      if (error.value.statusCode === 404) {
        // chat vazio, não precisa mostrar erro
        messages.value = []
      } else {
        toast.add({
          summary: 'Falha ao carregar mensagens',
          detail: 'Algo deu errado, recarregue a página',
          severity: 'error',
          life: 4000
        })
      } 
    } else if (data.value) {
      messages.value = data.value.messages
    }
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  // Garantir que há um session_id
  if (!chatStore.selectedChatId) {
    chatStore.selectedChatId = schema.parse(uuidv4())
    console.log(chatStore.selectedChatId)
  }

  const sessionId = chatStore.selectedChatId
  const userId = authStore.userId

  if (!userId) {
    navigateTo('/login')
    return
  }

  // Mensagem do usuário
  const userMsg: Message = {
    id: '',
    timestamp: Date.now(),
    author: 'user',
    role: 'user',
    text: newMessage.value
  }

  messages.value.push(userMsg)
  scrollToBottom()

  // Preparar payload para API
  const payload = {
    user_id: userId,
    session_id: sessionId,
    question: newMessage.value
  }

  console.log(payload)
  newMessage.value = "" // limpar input

  // Enviar para a API
  const { data, error } = await useAgentAPI<{ answer: string }>('/run-agent', {
    method: 'POST',
    body: payload
  })

  if (error.value) {
    toast.add({
      summary: 'Erro ao enviar mensagem',
      detail: 'Tente novamente mais tarde',
      severity: 'error',
      life: 4000
    })
    return
  }

  if (data.value) {
    // Mensagem do agente
    const agentMsg: Message = {
      id: '',
      timestamp: Date.now(),
      author: 'agent',
      role: 'assistant',
      text: data.value.answer
    }

    messages.value.push(agentMsg)
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatWindow.value) {
      chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
    }
  });
};

onUpdated(() => {
  if (chatWindow.value) {
    chatWindow.value.scrollTop = chatWindow.value.scrollHeight
  }
})

// Opcional: scroll inicial no client
onMounted(() => {
  scrollToBottom();
});
</script>
