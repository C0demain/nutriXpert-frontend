import { defineStore } from 'pinia'

interface Feedback {
  nota: number
  atendeu_expectativas: boolean
  comentario: string
}

const STORAGE_KEY = 'nutriXpert_feedbacks'

export const useFeedbackStore = defineStore('feedback', {
  state: () => ({
    feedbacks: {} as Record<string, Feedback>,
    loadedSessions: [] as string[]
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
    loadFromLocalStorage() {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try {
            this.feedbacks = JSON.parse(stored)
          } catch (e) {
            console.error('Erro ao carregar feedbacks do localStorage:', e)
          }
        }
      }
    },

    saveToLocalStorage() {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.feedbacks))
      }
    },

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

          if (!this.loadedSessions.includes(sessionId)) {
            this.loadedSessions.push(sessionId)
          }


          this.saveToLocalStorage()
          
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
      this.saveToLocalStorage()
    },

    clearSession(sessionId: string) {
      const index = this.loadedSessions.indexOf(sessionId)
      if (index > -1) {
        this.loadedSessions.splice(index, 1)
      }
    },

    clearAll() {
      this.feedbacks = {}
      this.loadedSessions = []
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }
})
