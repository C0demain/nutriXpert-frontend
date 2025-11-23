<template>
  <div class="flex flex-col shadow-xl w-full h-full overflow-hidden bg-white rounded-xl">
    <header class="p-4 font-bold text-white bg-gradient-to-br from-emerald-500 to-emerald-300">
      Chat
    </header>

    <!-- Tela inicial -->
    <div v-if="!chatStore.selectedChatId" class="h-full flex flex-col items-center justify-center p-8 text-center">
      <div class="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-4xl">
        🌱
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-3">Bem-vindo ao NutriXpert</h2>
      <p class="text-gray-500 mb-6 max-w-md">
        Selecione uma conversa existente ou inicie uma nova para começar
      </p>
    </div>

    <!-- Chat ativo -->
    <main v-else ref="chatWindow" class="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
      <div v-for="msg in messages" :key="msg.id" :class="msg.author === 'user' ? 'items-end' : 'items-start'"
        class="flex flex-col">
        <div :class="[
          msg.author === 'user'
            ? 'bg-emerald-500 text-white'
            : 'bg-gray-200 text-gray-800 relative group',
          'markdown-content',
        ]" class="px-3 py-2 rounded-md max-w-lg break-words" v-html="marked.parse(msg.text)"></div>

        <div v-if="msg.author === 'assistant' || msg.author === 'agent'" class="mt-2 flex items-center gap-2">
          <!-- Estado: ainda não avaliado -->
          <template v-if="msg.id && !msg.id.startsWith('temp_') && !feedbackStore.hasFeedback(msg.id)">
            <button @click="openFeedbackModal(msg)" class="flex items-center gap-2 px-3 py-1.5 border border-emerald-400 text-emerald-600 rounded-full text-sm font-medium
                hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-500
                active:scale-95 transition-all duration-200">
              <i class="pi pi-comments text-emerald-500"></i>
              Avaliar resposta
            </button>
          </template>

          <!-- Estado: já avaliado -->
          <template v-else-if="msg.id && !msg.id.startsWith('temp_') && feedbackStore.hasFeedback(msg.id)">
            <button @click="openViewFeedbackModal(msg)"
              class="flex items-center gap-2 px-3 py-1.5 border border-green-400 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 active:scale-95 transition-all">
              <i class="pi pi-check-circle text-green-500"></i>
              Resposta avaliada
            </button>
          </template>
        </div>

        <span class="text-xs text-gray-400 mt-1">
          {{ formatDateTimeBR(msg.timestamp).time }}
          {{ formatDateTimeBR(msg.timestamp).date }}
        </span>
      </div>

      <!-- Modal de feedback (envio) -->
      <Dialog v-model:visible="feedbackModalVisible" modal header="Avaliar resposta" :closable="false"
        :style="{ width: '25rem' }">
        <div class="flex flex-col gap-3">
          <div>
            <label class="block text-sm text-gray-600 mb-2">
              Qualidade da resposta <span class="text-red-500">*</span>:
            </label>
            <div class="flex gap-1 items-center">
              <span v-for="star in 5" :key="star" class="cursor-pointer text-2xl transition" :class="[
                star <= feedbackData.nota
                  ? 'text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-300',
              ]" @click="setRating(star)">
                ★
              </span>
              <span class="text-sm text-gray-500 ml-2">
                {{ feedbackData.nota }} / 5
              </span>
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Atendeu às expectativas? <span class="text-red-500">*</span>
            </label>
            <select v-model="feedbackData.atendeu_expectativas"
              class="w-full border border-gray-300 rounded-md px-2 py-1">
              <option disabled value="">Selecione uma opção</option>
              <option :value="true">Sim</option>
              <option :value="false">Não</option>
            </select>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Comentário (opcional):
            </label>
            <textarea v-model="feedbackData.comentario" rows="3"
              class="w-full border border-gray-300 rounded-md px-2 py-1"
              placeholder="Deixe seu comentário..."></textarea>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <Button label="Cancelar" class="p-button-text text-gray-500" @click="feedbackModalVisible = false" />
            <Button label="Enviar" class="bg-emerald-500 text-white hover:bg-emerald-600 transition"
              @click="submitFeedback" />
          </div>
        </div>
      </Dialog>

      <!-- Modal de visualização do feedback -->
      <Dialog v-model:visible="viewFeedbackModalVisible" modal header="Sua Avaliação" :style="{ width: '25rem' }">
        <div class="flex flex-col gap-3">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Nota atribuída:</label>
            <div class="flex gap-1 items-center">
              <span v-for="star in 5" :key="star" class="text-2xl" :class="[
                star <= viewedFeedbackData.nota ? 'text-yellow-400' : 'text-gray-300',
              ]">
                ★
              </span>
              <span class="text-sm text-gray-500 ml-2">
                {{ viewedFeedbackData.nota }} / 5
              </span>
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">Atendeu às expectativas:</label>
            <p class="font-medium">
              {{ viewedFeedbackData.atendeu_expectativas ? "Sim" : "Não" }}
            </p>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">Comentário:</label>
            <p class="text-gray-700 whitespace-pre-line">
              {{ viewedFeedbackData.comentario || "Nenhum comentário fornecido." }}
            </p>
          </div>

          <div class="flex justify-end mt-4">
            <Button label="Fechar" class="p-button-text text-gray-500" @click="viewFeedbackModalVisible = false" />
          </div>
        </div>
      </Dialog>

      <!-- Indicador de digitação -->
      <div v-if="isTyping" class="flex items-start space-x-2">
        <div class="bg-gray-200 text-gray-800 px-3 py-2 rounded-md max-w-xs flex space-x-1">
          <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
          <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
          <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
        </div>
      </div>
    </main>

    <!-- Campo de envio -->
    <form v-if="chatStore.selectedChatId" @submit.prevent="sendMessage"
      class="flex gap-3 p-4 bg-white border-t border-gray-200 shadow-lg">
      <input v-model="newMessage" type="text" placeholder="Digite sua mensagem..."
        class="flex-1 rounded-full px-3 py-2 border-2 border-gray-300 focus:outline-0 focus:border-emerald-300 bg-white text-gray-800 placeholder-gray-400 text-base transition-all" />
      <Button icon="pi pi-arrow-up" type="submit" class="bg-emerald-500 text-white hover:bg-emerald-600 transition"
        :disabled="!newMessage.trim()" rounded />
    </form>
  </div>
</template>

<script setup lang="ts">
import { marked } from "marked";
import { v4 as uuidv4 } from "uuid";
import { nextTick, onMounted, ref, watch, onUpdated } from "vue";
import { z } from "zod";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

const schema = z.string().uuid();
const toast = useToast();
const chatStore = useChatStore();
const authStore = useAuthStore();
const feedbackStore = useFeedbackStore();

interface Message {
  id: string;
  timestamp: number;
  author: string;
  role: string;
  text: string;
}

interface ChatSession {
  messages: Message[];
}

const messages = ref<Message[]>([]);
const newMessage = ref("");
const isTyping = ref(false);
const chatWindow = ref<HTMLElement | null>(null);

const feedbackModalVisible = ref(false);
const viewFeedbackModalVisible = ref(false);
const selectedMessage = ref<Message | null>(null);

const feedbackData = ref({
  nota: 0,
  atendeu_expectativas: "" as string | boolean,
  comentario: "",
});

const viewedFeedbackData = ref({
  nota: 0,
  atendeu_expectativas: false,
  comentario: "",
});

const openFeedbackModal = (msg: Message) => {
  selectedMessage.value = msg;
  feedbackModalVisible.value = true;
};

const openViewFeedbackModal = (msg: Message) => {
  const saved = feedbackStore.getFeedback(msg.id);
  if (saved) {
    viewedFeedbackData.value = saved;
    viewFeedbackModalVisible.value = true;
  }
};

const setRating = (rating: number) => (feedbackData.value.nota = rating);

const submitFeedback = async () => {
  if (!selectedMessage.value) return;

  if (feedbackData.value.nota === 0) {
    toast.add({
      summary: "Erro",
      detail: "Por favor, atribua uma nota à resposta.",
      severity: "warn",
      life: 3000,
    });
    return;
  }

  if (feedbackData.value.atendeu_expectativas === "") {
    toast.add({
      summary: "Erro",
      detail: "Selecione se a resposta atendeu às expectativas.",
      severity: "warn",
      life: 3000,
    });
    return;
  }

  const messageId = selectedMessage.value.id || uuidv4();

  const payload = {
    session_id: chatStore.selectedChatId,
    message_id: messageId,
    user_id: authStore.userId || "user_test",
    nota: feedbackData.value.nota,
    atendeu_expectativas: feedbackData.value.atendeu_expectativas,
    comentario: feedbackData.value.comentario,
  };

  try {
    const { $api } = useNuxtApp();

    await $api("/agent/feedback", {
      method: "POST",
      body: payload
    });

    toast.add({
      summary: "Feedback enviado!",
      detail: "Obrigado pela sua avaliação.",
      severity: "success",
      life: 4000,
    });

    // Salvar no Pinia store
    feedbackStore.addFeedback(
      messageId,
      feedbackData.value.nota,
      feedbackData.value.atendeu_expectativas === true,
      feedbackData.value.comentario
    );

    feedbackModalVisible.value = false;
    feedbackData.value = { nota: 0, atendeu_expectativas: "", comentario: "" };
  } catch (error) {
    toast.add({
      summary: "Erro ao enviar feedback",
      detail: "Tente novamente mais tarde.",
      severity: "error",
      life: 4000,
    });
  }
};

// --- Mensagens e sessão ---
const getMessages = async (chatId: string, userId?: string, silent: boolean = false, useFetchApi: boolean = false) => {
  if (!userId) return navigateTo("/login");
  if (!chatId) return;

  try {
    let data: ChatSession;

    if (useFetchApi) {
      // Usar $api para chamadas após o componente estar montado
      const { $api } = useNuxtApp();
      data = await $api<ChatSession>(
        `/agent/sessions/${userId}/${chatId}`,
        { method: "GET" }
      );
    } else {
      // Usar useAPI para carregamento inicial
      const response = await useAPI<ChatSession>(
        `/agent/sessions/${userId}/${chatId}`,
        { method: "GET" }
      );

      if (response.error.value) {
        if (!silent) {
          toast.add({
            summary: "Erro ao carregar mensagens",
            detail: "Não foi possível carregar o histórico.",
            severity: "error",
            life: 4000,
          });
        }
        return;
      }

      if (!response.data.value) return;
      data = response.data.value;
    }

    messages.value = data.messages ?? [];
    
    // Carregar feedbacks da sessão sempre (mesmo em modo silent)
    await feedbackStore.loadFeedbacksForSession(chatId, userId);
    
    await nextTick();
    scrollToBottom();
  } catch (error) {
    if (!silent) {
      toast.add({
        summary: "Erro ao carregar mensagens",
        detail: "Não foi possível carregar o histórico.",
        severity: "error",
        life: 4000,
      });
    }
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  if (!chatStore.selectedChatId) {
    chatStore.selectedChatId = schema.parse(uuidv4());
  }

  const sessionId = chatStore.selectedChatId;
  const userId = authStore.userId;
  if (!userId) return navigateTo("/login");

  const userMsg: Message = {
    id: "",
    timestamp: Date.now(),
    author: "user",
    role: "user",
    text: newMessage.value,
  };

  messages.value.push(userMsg);
  scrollToBottom();

  const payload = {
    user_id: userId,
    session_id: sessionId,
    question: newMessage.value,
    _ts: Date.now(),
  };

  newMessage.value = "";
  isTyping.value = true;

  try {
    const { $api } = useNuxtApp();

    const data = await $api<{ answer: string }>("/agent/run-agent", {
      method: "POST",
      body: payload,
    });

    isTyping.value = false;

    if (data && data.answer) {
      // Adicionar a resposta temporariamente para exibição imediata
      const tempId = `temp_${uuidv4()}`;
      const agentMsg: Message = {
        id: tempId,
        timestamp: Date.now(),
        author: "agent",
        role: "assistant",
        text: data.answer,
      };

      messages.value.push(agentMsg);
      scrollToBottom();

      // Polling: tentar recarregar até conseguir o ID real (máximo 5 tentativas)
      let attempts = 0;
      const maxAttempts = 5;
      const pollInterval = 1000; // 1 segundo entre tentativas

      const pollMessages = async () => {
        attempts++;
        
        await getMessages(sessionId, userId, true, true); // usar $api
        
        const stillHasTempId = messages.value.some(m => m.id.startsWith('temp_'));
        
        if (stillHasTempId && attempts < maxAttempts) {
          setTimeout(pollMessages, pollInterval);
        }
      };

      // Iniciar polling após 1 segundo
      setTimeout(pollMessages, 1000);
    }
  } catch (error: any) {
    isTyping.value = false;

    let errorMessage = "Tente novamente mais tarde.";

    // Tratamento específico para erro 429 (Too Many Requests)
    if (error?.status === 429 || error?.statusCode === 429) {
      errorMessage = "Limite de requisições atingido. Aguarde alguns minutos antes de tentar novamente.";
    } else if (error?.status === 500) {
      errorMessage = "Erro no servidor. Por favor, tente novamente.";
    }

    toast.add({
      summary: "Erro ao enviar mensagem",
      detail: errorMessage,
      severity: "error",
      life: 4000,
    });
  }
};

// --- Utilidades ---
const timestampToDate = (timestamp: number) => {
  // se o timestamp > 10 dígitos: é milissegundos
  if (timestamp > 9999999999) {
    return new Date(timestamp); // já está em ms
  }

  // caso contrário é segundos
  return new Date(timestamp * 1000);
};


const formatDateTimeBR = (timestamp: number) => {
  const d = timestampToDate(timestamp);

  return {
    time: d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    }),
    date: d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  };
};


const scrollToBottom = () => {
  nextTick(() => {
    if (chatWindow.value)
      chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
  });
};

watch(
  () => chatStore.selectedChatId,
  (newId) => {
    messages.value = [];
    feedbackStore.clearFeedbacks();
    const userId = authStore.userId;
    if (newId && userId) getMessages(newId, userId);
  },
  { immediate: true }
);

onMounted(() => {
  scrollToBottom();
});

onUpdated(scrollToBottom);
</script>
