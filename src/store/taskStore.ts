import { defineStore } from 'pinia'
import * as taskApi from '@/api/taskApi'

export interface Task {
  id: number
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
}

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    loaded: false,
  }),
  getters: {
    todoTasks: (state) => state.tasks.filter((t) => t.status === 'todo'),
    inProgressTasks: (state) => state.tasks.filter((t) => t.status === 'in-progress'),
    doneTasks: (state) => state.tasks.filter((t) => t.status === 'done'),
    tasksByPriority: (state) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      const statusOrder = { 'todo': 0, 'in-progress': 0, 'done': 1 }
      return [...state.tasks].sort((a, b) => {
        if (statusOrder[a.status] !== statusOrder[b.status])
          return statusOrder[a.status] - statusOrder[b.status]
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })
    },
  },
  actions: {
    async fetchTasks() {
      try {
        this.tasks = await taskApi.getTasks()
        this.loaded = true
      } catch {
        // 后端不可用时保持现有数据
      }
    },
    async addTask(task: Omit<Task, 'id' | 'createdAt'>) {
      try {
        const created = await taskApi.createTask(task)
        this.tasks.push(created)
      } catch {
        // 后端不可用时本地添加
        this.tasks.push({ ...task, id: Date.now(), createdAt: new Date().toISOString() })
      }
    },
    async updateTask(task: Task) {
      try {
        const updated = await taskApi.updateTask(task)
        const index = this.tasks.findIndex((t) => t.id === task.id)
        if (index !== -1) this.tasks[index] = updated
      } catch {
        const index = this.tasks.findIndex((t) => t.id === task.id)
        if (index !== -1) this.tasks[index] = task
      }
    },
    async removeTask(id: number) {
      try {
        await taskApi.deleteTask(id)
      } catch {
        // 忽略后端错误，本地仍然删除
      }
      this.tasks = this.tasks.filter((t) => t.id !== id)
    },
    async updateStatus(id: number, status: Task['status']) {
      const task = this.tasks.find((t) => t.id === id)
      if (task) await this.updateTask({ ...task, status })
    },
  },
})
