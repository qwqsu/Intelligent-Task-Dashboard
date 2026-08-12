<template>
  <el-card class="calendar-card">
    <div class="calendar-nav">
      <el-button text aria-label="上个月" @click="prevMonth"><el-icon><ArrowLeft /></el-icon></el-button>
      <span class="month-title">{{ currentMonthLabel }}</span>
      <el-button text aria-label="下个月" @click="nextMonth"><el-icon><ArrowRight /></el-icon></el-button>
    </div>
    <div class="calendar-grid">
      <div v-for="day in weekDays" :key="day" class="day-header">{{ day }}</div>
      <button
        v-for="cell in calendarCells"
        :key="cell.key"
        type="button"
        class="day-cell"
        :class="{
          'other-month': !cell.currentMonth,
          'today': cell.isToday,
          'selected': props.selectedDate === cell.dateStr,
          'has-events': cell.events.length > 0,
        }"
        :disabled="!cell.currentMonth"
        :aria-label="`${cell.dateStr}，${cell.events.length}个事件`"
        @click="cell.currentMonth && emit('dateClick', cell.dateStr)"
        @dblclick.prevent="cell.currentMonth && emit('dateNew', cell.dateStr)"
      >
        <span class="day-num">{{ cell.day }}</span>
        <span v-if="cell.events.length" class="event-count">{{ cell.events.length }}</span>
        <div class="event-dots">
          <span
            v-for="ev in cell.events.slice(0, 3)"
            :key="ev.id"
            class="event-dot"
            :style="{ background: ev.color || '#2f5d50' }"
            :title="ev.title"
          />
        </div>
      </button>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { useCalendarStore } from '@/store/calendarStore'

const props = withDefaults(defineProps<{ selectedDate?: string }>(), { selectedDate: '' })
const emit = defineEmits<{ dateClick: [date: string]; dateNew: [date: string] }>()
const calendarStore = useCalendarStore()

const currentDate = ref(dayjs())
const weekDays = ['日', '一', '二', '三', '四', '五', '六']
const currentMonthLabel = computed(() => currentDate.value.format('YYYY年MM月'))

function prevMonth() { currentDate.value = currentDate.value.subtract(1, 'month') }
function nextMonth() { currentDate.value = currentDate.value.add(1, 'month') }
function goToday() { currentDate.value = dayjs() }

defineExpose({ goToday })

const calendarCells = computed(() => {
  const start = currentDate.value.startOf('month').startOf('week')
  const end = currentDate.value.endOf('month').endOf('week')
  const cells: {
    key: string
    day: number
    dateStr: string
    currentMonth: boolean
    isToday: boolean
    events: ReturnType<typeof calendarStore.eventsOnDate>
  }[] = []
  let date = start
  while (date.isBefore(end) || date.isSame(end, 'day')) {
    const dateStr = date.format('YYYY-MM-DD')
    cells.push({
      key: dateStr,
      day: date.date(),
      dateStr,
      currentMonth: date.month() === currentDate.value.month(),
      isToday: date.isSame(dayjs(), 'day'),
      events: calendarStore.eventsOnDate(dateStr),
    })
    date = date.add(1, 'day')
  }
  return cells
})
</script>

<style scoped>
.calendar-nav { display: flex; align-items: center; justify-content: center; gap: 17px; margin-bottom: 18px; }
.month-title { min-width: 130px; color: var(--ink-950); font-size: 16px; font-weight: 750; text-align: center; }
.calendar-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 5px; }
.day-header { padding: 4px; color: var(--ink-400); font-size: 11px; font-weight: 700; text-align: center; }
.day-cell { position: relative; min-height: 78px; padding: 8px; background: var(--surface); border: 1px solid var(--el-border-color-lighter); border-radius: 5px; color: var(--ink-800); cursor: pointer; text-align: left; transition: background-color 0.18s ease, border-color 0.18s ease; }
.day-cell:hover { background: var(--surface-muted); border-color: var(--line-strong); }
.day-cell.other-month { background: var(--surface-muted); color: var(--ink-400); cursor: default; opacity: 0.58; }
.day-cell.today { border-color: var(--moss); }
.day-cell.today .day-num { display: inline-grid; width: 22px; height: 22px; place-items: center; background: var(--moss); border-radius: 50%; color: #fff; }
.day-cell.selected { background: var(--moss-soft); border-color: var(--moss); box-shadow: 0 0 0 1px var(--moss) inset; }
.day-num { display: inline-block; font-size: 12px; font-weight: 700; line-height: 22px; }
.event-count { position: absolute; top: 9px; right: 8px; color: var(--moss); font-size: 10px; font-weight: 750; }
.event-dots { display: flex; gap: 4px; margin-top: 15px; }
.event-dot { width: 7px; height: 7px; border-radius: 50%; }

@media (max-width: 560px) {
  .day-cell { min-height: 55px; padding: 5px; }
  .day-cell.today .day-num { width: 20px; height: 20px; line-height: 20px; }
  .event-dots { margin-top: 8px; }
}
</style>
