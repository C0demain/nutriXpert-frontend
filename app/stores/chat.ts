import { defineStore } from 'pinia'

interface Chat {
  session_id: string
  first__message: string
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    selectedChatId: '' as string,
    selectedFirstMessage: '' as string
  }),
  actions: {
    selectChat(id: string, firstMessage: string) {
      this.selectedChatId = id
      this.selectedFirstMessage = firstMessage
    }
  }
})
