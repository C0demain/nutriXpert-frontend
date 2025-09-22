<template>
  <div class="flex justify-center items-center h-screen">
   
    <div class="flex flex-col h-[90vh] w-[95vw] max-w-3xl bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
     
      <header class="p-4 font-bold text-white" style="background-color: #42b883;">
        Chat NutriXpert 
      </header>

      <main
        ref="chatWindow"
        class="flex-1 overflow-y-auto p-4 space-y-3"
      >
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="flex flex-col"
          :class="msg.sender === 'user' ? 'items-end' : 'items-start'"
        >
          <div
            :class="[
              'px-3 py-2 text-sm rounded-lg shadow',
              'max-w-[70%] break-words',
              msg.sender === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-black'
            ]"
          >
            {{ msg.text }}
          </div>
          <span class="text-xs text-gray-400 mt-1">
            {{ msg.time }}
          </span>
        </div>
      </main>

      <form
        @submit.prevent="sendMessage"
        class="flex p-3 bg-gray-900 border-t border-gray-700"
      >
        <input
          v-model="newMessage"
          type="text"
          placeholder="Digite sua mensagem..."
          class="flex-1 border rounded-full px-3 py-2 mr-2 focus:outline-none focus:ring focus:ring-green-400 bg-gray-700 text-white placeholder-gray-400 text-sm"
        />
        <button
          type="submit"
          class="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition text-sm"
        >
          Enviar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";

const messages = ref<{ sender: string; text: string; time: string }[]>([]);
const newMessage = ref("");
const chatWindow = ref<HTMLElement | null>(null);

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  messages.value.push({ sender: "user", text: newMessage.value, time: now });

  const userMessage = newMessage.value;
  newMessage.value = "";

  setTimeout(() => {
    const botNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    messages.value.push({
      sender: "bot",
      text: "Simulação da IA: " + userMessage,
      time: botNow,
    });
    scrollToBottom();
  }, 1000);

  scrollToBottom();
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatWindow.value) {
      chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
    }
  });
};
</script>
