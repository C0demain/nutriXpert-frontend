import { defineStore } from 'pinia'

interface Feedback {
  nota: number
  atendeu_expectativas: boolean
  comentario: string
}

export const useFeedbackStore = defineStore('feedback', {
  state: () => ({
    feedbacks: {} as Record<string, Feedback>
  }),

  getters: {
    hasFeedback: (state) => (messageId: string) => {
      return !!state.feedbacks[messageId]
    },
    
    getFeedback: (state) => (messageId: string) => {
      return state.feedbacks[messageId]
    }
  },

  actions: {
    async loadFeedbacksForSession(sessionId: string, userId: string) {
      try {
        const { $api } = useNuxtApp()
        
        const data = await $api<any[]>(
          `/agent/feedback/conversa/${userId}/${sessionId}`,
          { method: "GET" }
        )

        if (data && Array.isArray(data)) {
          data.forEach((feedback: any) => {
            if (feedback.message_id) {
              this.feedbacks[feedback.message_id] = {
                nota: feedback.nota,
                atendeu_expectativas: feedback.atendeu_expectativas,
                comentario: feedback.comentario,
              }
            }
          })
        }
      } catch (error) {
        console.error("Erro ao carregar feedbacks:", error)
      }
    },

    addFeedback(messageId: string, nota: number, atendeu_expectativas: boolean, comentario: string) {
      this.feedbacks[messageId] = {
        nota,
        atendeu_expectativas,
        comentario
      }
    },

    clearFeedbacks() {
      this.feedbacks = {}
    }
  }
})
