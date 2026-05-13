import { defineStore } from 'pinia'
import * as calendarApi from '@/api/calendarApi'

export interface CalendarEvent {
  id: number
  title: string
  description?: string
  start: string
  end: string
  allDay?: boolean
  color?: string
}

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    events: [] as CalendarEvent[],
    loaded: false,
  }),
  getters: {
    todayEvents: (state) => {
      const today = new Date().toISOString().slice(0, 10)
      return state.events.filter((e) => e.start.startsWith(today))
    },
    upcomingEvents: (state) => {
      const now = new Date().toISOString()
      return state.events
        .filter((e) => e.start >= now)
        .sort((a, b) => a.start.localeCompare(b.start))
        .slice(0, 5)
    },
  },
  actions: {
    async fetchEvents() {
      try {
        this.events = await calendarApi.getEvents()
        this.loaded = true
      } catch {
        // 后端不可用时保持现有数据
      }
    },
    async addEvent(event: Omit<CalendarEvent, 'id'>) {
      try {
        const created = await calendarApi.createEvent(event)
        this.events.push(created)
      } catch {
        this.events.push({ ...event, id: Date.now() })
      }
    },
    async updateEvent(event: CalendarEvent) {
      try {
        const updated = await calendarApi.updateEvent(event)
        const index = this.events.findIndex((e) => e.id === event.id)
        if (index !== -1) this.events[index] = updated
      } catch {
        const index = this.events.findIndex((e) => e.id === event.id)
        if (index !== -1) this.events[index] = event
      }
    },
    async removeEvent(id: number) {
      try {
        await calendarApi.deleteEvent(id)
      } catch {
        // 忽略后端错误
      }
      this.events = this.events.filter((e) => e.id !== id)
    },
  },
})
