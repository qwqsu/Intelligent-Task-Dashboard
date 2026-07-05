import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_AI_API_BASE_URL ?? '/api',
  timeout: 30000,
})

export const getAISuggestions = async (input: string): Promise<string[]> => {
  const res = await api.post('/ai/suggestions', { input })
  return res.data.suggestions
}

export interface AIAction {
  action: 'create_task' | 'create_event'
  payload: Record<string, unknown>
}

export interface AIMessageResponse {
  reply: string
  action: AIAction | null
}

export const sendAIMessage = async (
  messages: { role: 'user' | 'assistant'; content: string }[],
  context?: { tasks?: unknown[]; events?: unknown[] },
): Promise<AIMessageResponse> => {
  const res = await api.post('/ai/messages', { messages, context })
  return { reply: res.data.reply, action: res.data.action ?? null }
}

export const getTaskPrioritySuggestion = async (
  taskTitles: string[],
): Promise<{ id: string; priority: string; reason: string }[]> => {
  const res = await api.post('/ai/prioritize', { tasks: taskTitles })
  return res.data.result
}
