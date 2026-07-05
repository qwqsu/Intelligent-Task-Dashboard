<template>
  <div class="page-container">
    <div class="calendar-header">
      <h2>日程管理</h2>
      <el-button type="primary" @click="openNewForm('')">
        <el-icon><Plus /></el-icon> 新建事件
      </el-button>
    </div>

    <el-row :gutter="16">
      <el-col :span="16">
        <CalendarView @date-click="handleDateClick" @date-new="openNewForm" />
      </el-col>
      <el-col :span="8" class="side-col">
        <!-- 选中日期的事件面板 -->
        <el-card v-if="selectedDate" class="date-panel">
          <template #header>
            <div class="panel-header">
              <span>{{ selectedDateLabel }}</span>
              <el-button size="small" type="primary" @click="openNewForm(selectedDate)">
                <el-icon><Plus /></el-icon> 新建
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
          <el-empty v-else description="该日暂无事件，点击新建添加" :image-size="50" />
        </el-card>

        <!-- 未选中日期时显示今日事件 -->
        <el-card v-else header="今日事件">
          <EventItem
            v-for="event in calendarStore.todayEvents"
            :key="event.id"
            :event="event"
            @edit="handleEdit"
            @delete="calendarStore.removeEvent(event.id)"
          />
          <el-empty v-if="calendarStore.todayEvents.length === 0" description="今日暂无事件" :image-size="60" />
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="showForm" :title="editingEvent ? '编辑事件' : '新建事件'" width="500px" destroy-on-close>
      <EventForm :initial="editingEvent" :default-date="formDefaultDate" @submit="handleFormSubmit" @cancel="closeForm" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { useCalendarStore } from '@/store/calendarStore'
import type { CalendarEvent } from '@/store/calendarStore'
import CalendarView from '@/components/Calendar/CalendarView.vue'
import EventItem from '@/components/Calendar/EventItem.vue'
import EventForm from '@/components/Calendar/EventForm.vue'

const calendarStore = useCalendarStore()
const showForm = ref(false)
const editingEvent = ref<CalendarEvent | null>(null)
const selectedDate = ref('')
const formDefaultDate = ref('')

const selectedDateLabel = computed(() =>
  selectedDate.value ? dayjs(selectedDate.value).format('YYYY年MM月DD日') : ''
)

const selectedDateEvents = computed(() =>
  calendarStore.events.filter((e) => e.start.startsWith(selectedDate.value))
)

function handleDateClick(date: string) {
  // 点击日期：切换选中状态，不直接弹表单
  selectedDate.value = selectedDate.value === date ? '' : date
}

function openNewForm(date: string) {
  formDefaultDate.value = date
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
    calendarStore.updateEvent(event as CalendarEvent)
  } else {
    calendarStore.addEvent(event as Omit<CalendarEvent, 'id'>)
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
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.side-col {
  display: flex;
  flex-direction: column;
}
.date-panel {
  border-color: var(--el-color-primary-light-5);
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}
</style>
