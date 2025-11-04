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
        <div :class="[msg.author === 'user'
          ? 'bg-emerald-500 text-white'
          : 'bg-gray-200 text-gray-800 relative group',
          'markdown-content']" class="px-3 py-2 rounded-md max-w-lg break-words" v-html="marked.parse(msg.text)">
        </div>

        <div v-if="msg.author === 'agent'" class="mt-2 flex items-center gap-2">
          <!-- Estado: ainda não avaliado -->
          <template v-if="!feedbacks[msg.id]">
            <button @click="openFeedbackModal(msg)" class="flex items-center gap-2 px-3 py-1.5 border border-emerald-400 text-emerald-600 rounded-full text-sm font-medium
             hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-500
             active:scale-95 transition-all duration-200">
              <i class="pi pi-comments text-emerald-500"></i>
              Avaliar resposta
            </button>
          </template>

          <!-- Estado: já avaliado -->
          <template v-else>
            <span
              class="flex items-center gap-2 px-3 py-1.5 border border-green-400 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              <i class="pi pi-check-circle text-green-500"></i>
              Avaliação enviada
            </span>
          </template>
        </div>

        <span class="text-xs text-gray-400 mt-1">
          {{ timestampToDate(msg.timestamp).toLocaleTimeString().substring(0, 5) }}
          {{ timestampToDate(msg.timestamp).toLocaleDateString() }}
        </span>
      </div>

      <!-- Modal de feedback -->
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

// --- Feedback ---
const feedbacks = ref<Record<string, boolean>>({});
onMounted(() => {
  const stored = localStorage.getItem("sent_feedbacks");
  if (stored) feedbacks.value = JSON.parse(stored);
});

watch(feedbacks, (newVal) => {
  localStorage.setItem("sent_feedbacks", JSON.stringify(newVal));
}, { deep: true });

const feedbackModalVisible = ref(false);
const selectedMessage = ref<Message | null>(null);
const feedbackData = ref({ nota: 0, atendeu_expectativas: "", comentario: "" });

const openFeedbackModal = (msg: Message) => {
  if (feedbacks.value[msg.id]) return;
  selectedMessage.value = msg;
  feedbackModalVisible.value = true;
};

const setRating = (rating: number) => (feedbackData.value.nota = rating);

// --- Buscar mensagens ---
const getMessages = async (chatId: string, userId?: string) => {
  if (!userId) return navigateTo("/login");
  if (!chatId) return;

  const { data, error } = await useAPI<ChatSession>(
    `/agent/sessions/${userId}/${chatId}`,
    { method: "GET" }
  );

  if (error.value) {
    if (error.value.statusCode === 404) {
      messages.value = [];
    } else {
      toast.add({
        summary: "Erro ao carregar mensagens",
        detail: "Não foi possível carregar o histórico.",
        severity: "error",
        life: 4000,
      });
    }
    return;
  }

  if (data.value) {
    messages.value = data.value.messages ?? [];
    await nextTick();
    scrollToBottom();
  }
};

// --- Enviar feedback ---
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

  const payload = {
    message_id: selectedMessage.value.id || uuidv4(),
    user_id: authStore.userId || "user_test",
    nota: feedbackData.value.nota,
    atendeu_expectativas: feedbackData.value.atendeu_expectativas,
    comentario: feedbackData.value.comentario,
  };

  const { error } = await useAPI("/agent/feedback", { method: "POST", body: payload });

  if (error.value) {
    toast.add({
      summary: "Erro ao enviar feedback",
      detail: "Tente novamente mais tarde.",
      severity: "error",
      life: 4000,
    });
  } else {
    toast.add({
      summary: "Feedback enviado!",
      detail: "Obrigado pela sua avaliação.",
      severity: "success",
      life: 4000,
    });
    feedbacks.value[selectedMessage.value.id] = true;
    feedbackModalVisible.value = false;
    feedbackData.value = { nota: 0, atendeu_expectativas: "", comentario: "" };
  }
};

// --- Enviar mensagem ---
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
    _ts: Date.now(), // evita cache
  };

  newMessage.value = "";
  isTyping.value = true;

  const { data, error } = await useAPI<{ answer: string }>("/agent/run-agent", {
    method: "POST",
    body: payload,
  });

  isTyping.value = false;

  if (error.value) {
    toast.add({
      summary: "Erro ao enviar mensagem",
      detail: "Tente novamente mais tarde.",
      severity: "error",
      life: 4000,
    });
    return;
  }

  if (data.value) {
    const agentMsg: Message = {
      id: uuidv4(),
      timestamp: Date.now(),
      author: "agent",
      role: "assistant",
      text: data.value.answer,
    };

    messages.value.push(agentMsg);
    scrollToBottom();
  }
};

// --- Watch sessão selecionada ---
watch(
  () => chatStore.selectedChatId,
  (newId) => {
    messages.value = [];
    const userId = authStore.userId;
    if (newId && userId) getMessages(newId, userId);
  },
  { immediate: true }
);

const timestampToDate = (timestamp: number) => new Date(timestamp * 1000);

const scrollToBottom = () => {
  nextTick(() => {
    if (chatWindow.value)
      chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
  });
};

onUpdated(scrollToBottom);
onMounted(scrollToBottom);
</script>
