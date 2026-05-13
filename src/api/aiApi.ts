import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_AI_API_BASE_URL ?? '/api',
  timeout: 30000,
})

export const getAISuggestions = async (input: string): Promise<string[]> => {
  const res = await api.post('/ai/suggestions', { input })
  return res.data.suggestions
}

export const sendAIMessage = async (
  messages: { role: 'user' | 'assistant'; content: string }[],
  context?: { tasks?: unknown[]; events?: unknown[] },
): Promise<string> => {
  const res = await api.post('/ai/messages', { messages, context })
  return res.data.reply
}

export const getTaskPrioritySuggestion = async (
  taskTitles: string[],
): Promise<{ id: string; priority: string; reason: string }[]> => {
  const res = await api.post('/ai/prioritize', { tasks: taskTitles })
  return res.data.result
}
