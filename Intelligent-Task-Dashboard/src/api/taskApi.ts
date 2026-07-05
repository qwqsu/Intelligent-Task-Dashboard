import axios from 'axios'
import type { Task } from '@/store/taskStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10000,
})

export const getTasks = async (): Promise<Task[]> => {
  const res = await api.get('/tasks')
  return res.data
}

export const createTask = async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
  const res = await api.post('/tasks', task)
  return res.data
}

export const updateTask = async (task: Task): Promise<Task> => {
  const res = await api.patch(`/tasks/${task.id}`, task)
  return res.data
}

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`)
}
