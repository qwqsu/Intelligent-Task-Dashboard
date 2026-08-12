import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import * as taskApi from '@/api/taskApi'

export interface Task {
  id: number
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  completedAt?: string
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
    todayTasks: (state) => {
      const today = dayjs().format('YYYY-MM-DD')
      return state.tasks.filter((task) => task.dueDate?.startsWith(today))
    },
    overdueTasks: (state) =>
      state.tasks.filter(
        (task) => task.status !== 'done' && !!task.dueDate && dayjs(task.dueDate).isBefore(dayjs(), 'day'),
      ),
    todayCompletion: (state) => {
      const today = dayjs().format('YYYY-MM-DD')
      const tasks = state.tasks.filter((task) => task.dueDate?.startsWith(today))
      if (!tasks.length) return 0
      return Math.round((tasks.filter((task) => task.status === 'done').length / tasks.length) * 100)
    },
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
        // 后端不可用时保留本地持久化数据，应用仍可继续使用。
        this.loaded = true
      }
    },
    async addTask(task: Omit<Task, 'id' | 'createdAt'>) {
      try {
        const created = await taskApi.createTask(task)
        this.tasks.push(created)
      } catch {
        // 后端不可用时本地添加，配合持久化插件避免刷新后丢失。
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
      if (task) {
        await this.updateTask({
          ...task,
          status,
          completedAt: status === 'done' ? task.completedAt ?? new Date().toISOString() : undefined,
        })
      }
    },
  },
  persist: { paths: ['tasks'] },
})
