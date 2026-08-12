<template>
  <div class="page-container calendar-page">
    <div class="page-heading">
      <div>
        <p class="eyebrow">时间地图</p>
        <h1>日程</h1>
        <p>把固定安排和需要专注的时间放在同一张地图上。</p>
      </div>
      <div class="heading-actions">
        <el-button @click="goToday">回到今天</el-button>
        <el-button type="primary" @click="openNewForm('')">
          <el-icon><Plus /></el-icon>
          新建事件
        </el-button>
      </div>
    </div>

    <div class="calendar-summary">
      <div class="summary-item">
        <span class="summary-value">{{ calendarStore.todayEvents.length }}</span>
        <span class="summary-label">今日安排</span>
      </div>
      <div class="summary-item">
        <span class="summary-value">{{ calendarStore.upcomingEvents.length }}</span>
        <span class="summary-label">接下来</span>
      </div>
      <div class="summary-note">双击某一天，可以直接创建一段时间。</div>
    </div>

    <el-row :gutter="18">
      <el-col :span="16">
        <CalendarView ref="calendarRef" :selected-date="selectedDate" @date-click="handleDateClick" @date-new="openNewForm" />
      </el-col>
      <el-col :span="8" class="side-col">
        <el-card v-if="selectedDate" class="date-panel">
          <template #header>
            <div class="panel-header">
              <div>
                <span class="panel-kicker">已选择</span>
                <strong>{{ selectedDateLabel }}</strong>
              </div>
              <el-button size="small" type="primary" @click="openNewForm(selectedDate)">
                <el-icon><Plus /></el-icon>
                新建
              </el-button>
            </div>
          </template>
          <div v-if="selectedDateEvents.length">
            <EventItem
              v-for="event in selectedDateEvents"
              :key="event.id"
              :event="event"
              @edit="handleEdit"
              @delete="calendarStore.removeEvent(event.id)"
            />
          </div>
          <el-empty v-else description="这一天还没有安排" :image-size="50" />
        </el-card>

        <el-card v-else class="date-panel">
          <template #header>
            <div class="panel-header">
              <div>
                <span class="panel-kicker">今天</span>
                <strong>{{ todayLabel }}</strong>
              </div>
              <el-button size="small" text @click="openNewForm(todayDate)">添加</el-button>
            </div>
          </template>
          <EventItem
            v-for="event in calendarStore.todayEvents"
            :key="event.id"
            :event="event"
            @edit="handleEdit"
            @delete="calendarStore.removeEvent(event.id)"
          />
          <el-empty v-if="calendarStore.todayEvents.length === 0" description="今天还没有安排" :image-size="60" />
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="showForm" :title="editingEvent ? '编辑事件' : '新建事件'" width="520px" destroy-on-close>
      <EventForm :initial="editingEvent" :default-date="formDefaultDate" @submit="handleFormSubmit" @cancel="closeForm" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useCalendarStore } from '@/store/calendarStore'
import type { CalendarEvent } from '@/store/calendarStore'
import CalendarView from '@/components/Calendar/CalendarView.vue'
import EventItem from '@/components/Calendar/EventItem.vue'
import EventForm from '@/components/Calendar/EventForm.vue'

dayjs.locale('zh-cn')

const calendarStore = useCalendarStore()
const calendarRef = ref<{ goToday: () => void } | null>(null)
const showForm = ref(false)
const editingEvent = ref<CalendarEvent | null>(null)
const selectedDate = ref('')
const formDefaultDate = ref('')
const todayDate = dayjs().format('YYYY-MM-DD')
const todayLabel = dayjs().format('M月D日 dddd')

const selectedDateLabel = computed(() =>
  selectedDate.value ? dayjs(selectedDate.value).format('YYYY年M月D日 dddd') : '',
)

const selectedDateEvents = computed(() =>
  selectedDate.value ? calendarStore.eventsOnDate(selectedDate.value) : [],
)

function handleDateClick(date: string) {
  selectedDate.value = selectedDate.value === date ? '' : date
}

function goToday() {
  selectedDate.value = todayDate
  calendarRef.value?.goToday()
}

function openNewForm(date: string) {
  formDefaultDate.value = date || selectedDate.value || todayDate
  editingEvent.value = null
  showForm.value = true
}

function handleEdit(event: CalendarEvent) {
  editingEvent.value = event
  formDefaultDate.value = ''
  showForm.value = true
}

function handleFormSubmit(event: Omit<CalendarEvent, 'id'> | CalendarEvent) {
  if ('id' in event && (event as CalendarEvent).id) {
    void calendarStore.updateEvent(event as CalendarEvent)
  } else {
    void calendarStore.addEvent(event as Omit<CalendarEvent, 'id'>)
  }
  closeForm()
}

function closeForm() {
  showForm.value = false
  editingEvent.value = null
  formDefaultDate.value = ''
}
</script>

<style scoped>
.heading-actions { display: flex; gap: 8px; }
.calendar-summary { display: flex; align-items: center; gap: 28px; margin-bottom: 20px; padding: 14px 0; border-top: 1px solid var(--el-border-color-light); border-bottom: 1px solid var(--el-border-color-light); }
.summary-item { display: flex; align-items: baseline; gap: 7px; }
.summary-value { color: var(--moss); font-size: 22px; font-weight: 800; }
.summary-label { color: var(--ink-600); font-size: 11px; }
.summary-note { margin-left: auto; color: var(--ink-400); font-size: 11px; }
.side-col { display: flex; flex-direction: column; min-width: 0; }
.date-panel { height: 100%; }
.panel-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.panel-header strong, .panel-kicker { display: block; }
.panel-kicker { margin-bottom: 3px; color: var(--moss); font-size: 10px; font-weight: 750; letter-spacing: 0.1em; text-transform: uppercase; }
.panel-header strong { font-size: 14px; }

@media (max-width: 800px) {
  .heading-actions { width: 100%; }
  .heading-actions .el-button { flex: 1; }
  .calendar-summary { gap: 16px; }
  .summary-note { display: none; }
  .side-col { margin-top: 18px; }
}
</style>
