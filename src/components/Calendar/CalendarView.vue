<template>
  <el-card>
    <div class="calendar-nav">
      <el-button text @click="prevMonth"><el-icon><ArrowLeft /></el-icon></el-button>
      <span class="month-title">{{ currentMonthLabel }}</span>
      <el-button text @click="nextMonth"><el-icon><ArrowRight /></el-icon></el-button>
    </div>
    <div class="calendar-grid">
      <div v-for="day in weekDays" :key="day" class="day-header">{{ day }}</div>
      <div
        v-for="cell in calendarCells"
        :key="cell.key"
        class="day-cell"
        :class="{
          'other-month': !cell.currentMonth,
          'today': cell.isToday,
          'has-events': cell.events.length > 0,
        }"
        @click="cell.currentMonth && emit('dateClick', cell.dateStr)"
        @dblclick.prevent="cell.currentMonth && emit('dateNew', cell.dateStr)"
      >
        <span class="day-num">{{ cell.day }}</span>
        <div class="event-dots">
          <span
            v-for="ev in cell.events.slice(0, 3)"
            :key="ev.id"
            class="event-dot"
            :style="{ background: ev.color || '#409eff' }"
            :title="ev.title"
          />
        </div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { useCalendarStore } from '@/store/calendarStore'

const emit = defineEmits<{ dateClick: [date: string]; dateNew: [date: string] }>()
const calendarStore = useCalendarStore()

const currentDate = ref(dayjs())
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const currentMonthLabel = computed(() => currentDate.value.format('YYYY年MM月'))

function prevMonth() { currentDate.value = currentDate.value.subtract(1, 'month') }
function nextMonth() { currentDate.value = currentDate.value.add(1, 'month') }

const calendarCells = computed(() => {
  const start = currentDate.value.startOf('month').startOf('week')
  const end = currentDate.value.endOf('month').endOf('week')
  const cells = []
  let d = start
  while (d.isBefore(end) || d.isSame(end, 'day')) {
    const dateStr = d.format('YYYY-MM-DD')
    cells.push({
      key: dateStr,
      day: d.date(),
      dateStr,
      currentMonth: d.month() === currentDate.value.month(),
      isToday: d.isSame(dayjs(), 'day'),
      events: calendarStore.events.filter((e) => e.start.startsWith(dateStr)),
    })
    d = d.add(1, 'day')
  }
  return cells
})
</script>

<style scoped>
.calendar-nav { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 12px; }
.month-title { font-size: 16px; font-weight: 600; min-width: 120px; text-align: center; }
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.day-header { text-align: center; font-size: 12px; color: var(--el-text-color-secondary); padding: 4px; }
.day-cell {
  min-height: 64px;
  padding: 4px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
  user-select: none;
}
.day-cell:hover {
  background: var(--el-fill-color-light);
  border-color: var(--el-color-primary-light-5);
}
.day-cell.other-month { opacity: 0.4; cursor: default; }
.day-cell.today { border-color: var(--el-color-primary); background: var(--el-color-primary-light-9); }
.day-num { font-size: 13px; font-weight: 500; }
.event-dots { display: flex; gap: 2px; flex-wrap: wrap; margin-top: 2px; }
.event-dot { width: 6px; height: 6px; border-radius: 50%; }
</style>
