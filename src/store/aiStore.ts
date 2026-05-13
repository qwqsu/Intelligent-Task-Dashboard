import { defineStore } from 'pinia'

export interface AIMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export const useAIStore = defineStore('ai', {
  state: () => ({
    messages: [] as AIMessage[],
    loading: false,
    nextId: 1,
  }),
  actions: {
    addMessage(role: AIMessage['role'], content: string) {
      this.messages.push({
        id: this.nextId++,
        role,
        content,
        timestamp: new Date().toISOString(),
      })
    },
    clearMessages() {
      this.messages = []
      this.nextId = 1
    },
    setLoading(val: boolean) {
      this.loading = val
    },
  },
})
