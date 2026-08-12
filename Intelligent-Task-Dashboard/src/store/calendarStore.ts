import { defineStore } from 'pinia'
import dayjs from 'dayjs'
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
      const today = dayjs().format('YYYY-MM-DD')
      return state.events
        .filter((event) => event.start.startsWith(today))
        .sort((a, b) => a.start.localeCompare(b.start))
    },
    upcomingEvents: (state) => {
      const now = dayjs()
      return state.events
        .filter((event) => dayjs(event.start).isAfter(now))
        .sort((a, b) => a.start.localeCompare(b.start))
        .slice(0, 5)
    },
    eventsOnDate: (state) => (date: string) =>
      state.events.filter((event) => event.start.startsWith(date)).sort((a, b) => a.start.localeCompare(b.start)),
  },
  actions: {
    async fetchEvents() {
      try {
        const events = await calendarApi.getEvents()
        this.events = events.map((event) => {
          const start = dayjs(event.start)
          const end = dayjs(event.end)
          // 兼容旧数据中结束时间早于开始时间的记录，避免日程卡片显示反向时间段。
          if (start.isValid() && end.isValid() && end.isBefore(start)) {
            return { ...event, end: start.add(1, 'hour').format('YYYY-MM-DDTHH:mm:ss') }
          }
          return event
        })
        this.loaded = true
      } catch {
        this.loaded = true
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
  persist: { paths: ['events'] },
})
