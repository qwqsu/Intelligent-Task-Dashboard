import axios from 'axios'
import type { CalendarEvent } from '@/store/calendarStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10000,
})

export const getEvents = async (): Promise<CalendarEvent[]> => {
  const res = await api.get('/events')
  return res.data
}

export const createEvent = async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
  const res = await api.post('/events', event)
  return res.data
}

export const updateEvent = async (event: CalendarEvent): Promise<CalendarEvent> => {
  const res = await api.patch(`/events/${event.id}`, event)
  return res.data
}

export const deleteEvent = async (id: number): Promise<void> => {
  await api.delete(`/events/${id}`)
}
