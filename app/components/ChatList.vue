<template>
  <div class="flex flex-col h-full w-full overflow-hidden">
   
  <header class="flex justify-between items-center p-4 border-b border-emerald-100 gap-8">
    <h2 class="text-xl font-bold text-emerald-700">Conversas</h2>
    <button
      @click="newChat"
      class="bg-emerald-500 text-white px-3 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-200 text-sm font-semibold flex items-center gap-2"
    >
      <i class="pi pi-plus text-sm"></i>
      <span>Nova Conversa</span>
    </button>
  </header>

    <main class="flex-1 p-4 space-y-3 overflow-y-auto">
      <div
        v-for="chat in chats"
        :key="chat.session_id"
        @click="selectChat(chat.session_id, chat.first_message)"
        class="group px-4 py-2 rounded-xl border border-emerald-100 cursor-pointer hover:border-emerald-300 transition-all duration-200 flex justify-between items-center bg-white"
        :class="{
          'ring-2 ring-emerald-500 border-emerald-500':
            chatStore.selectedChatId === chat.session_id,
        }"
      >
        <div class="flex items-start gap-3 flex-1 min-w-0">
          <div class="flex-1 min-w-0">
            <p
              class="text-gray-800 font-medium truncate first-letter:capitalize"
            >
              {{ chat.first_message }}
            </p>
            <span class="text-xs text-gray-400 font-mono mt-1 inline-block">
              ID: {{ chat.session_id.slice(0, 8) }}
            </span>
          </div>
        </div>
        <i
          class="pi pi-chevron-right text-gray-300 group-hover:text-emerald-600 transition-colors text-sm ml-2"
        ></i>
      </div>

      
      <div
        v-if="chats.length === 0"
        class="flex flex-col items-center justify-center mt-16 text-center px-4"
      >
        <div
          class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4"
        >
          <i class="pi pi-comments text-4xl text-emerald-600"></i>
        </div>
        <p class="text-gray-500 font-medium mb-2">Nenhuma conversa ainda</p>
        <p class="text-gray-400 text-sm">
          Clique em "Nova Conversa" para começar
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useAgentAPI } from "~/composables/useAgentAPI";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "~/stores/auth";
import { useChatStore } from "~/stores/chat";

interface Chat {
  session_id: string;
  first_message: string;
}

type GetChatsResponse = Chat[];

const toast = useToast();
const authStore = useAuthStore();
const chatStore = useChatStore();

const chats = ref<Chat[]>([]);

function selectChat(id: string, firstMessage: string) {
  chatStore.selectChat(id, firstMessage);
}

function newChat() {
 
  const newId = crypto.randomUUID();

 
  chatStore.selectChat(newId, "");

  
  chats.value.unshift({
    session_id: newId,
    first_message: "Nova conversa",
  });
}

async function getChats(id?: string) {
  if (!id) return;

  const { data, error } = await useAgentAPI<GetChatsResponse>(`/${id}/list`, {
    method: "GET",
  });

  if (error.value) {
    toast.add({
      summary: "Falha ao carregar conversas",
      detail: "Algo deu errado, recarregue a página",
      severity: "error",
      life: 4000,
    });
  } else if (data.value) {
    chats.value = data.value;
  }
}


watch(
  () => authStore.userId,
  (id) => {
    if (id) {
      getChats(id);
    }
  },
  { immediate: true }
);


watch(
  () => chatStore.selectedChatId,
  (newId, oldId) => {
   
    if (newId && !oldId) {
      getChats(authStore.userId ?? undefined);
    }
  }
);
</script>
