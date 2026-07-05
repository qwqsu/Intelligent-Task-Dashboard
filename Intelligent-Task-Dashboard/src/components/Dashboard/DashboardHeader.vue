<template>
  <el-card class="dashboard-header">
    <div class="header-content">
      <div class="greeting">
        <h1>{{ greeting }}，{{ userStore.name }} 👋</h1>
        <p class="date-text">{{ dateText }}</p>
      </div>
      <div class="quick-stats">
        <div class="stat-item">
          <span class="stat-num">{{ taskStore.todoTasks.length }}</span>
          <span class="stat-label">待办任务</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ taskStore.inProgressTasks.length }}</span>
          <span class="stat-label">进行中</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ calendarStore.todayEvents.length }}</span>
          <span class="stat-label">今日事件</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useUserStore } from '@/store/userStore'
import { useTaskStore } from '@/store/taskStore'
import { useCalendarStore } from '@/store/calendarStore'

dayjs.locale('zh-cn')

const userStore = useUserStore()
const taskStore = useTaskStore()
const calendarStore = useCalendarStore()

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '夜深了'
  if (h < 12) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
})

const dateText = computed(() => dayjs().format('YYYY年MM月DD日 dddd'))
</script>

<style scoped>
.dashboard-header { margin-bottom: 0; }
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.greeting h1 { font-size: 24px; margin-bottom: 4px; }
.date-text { color: var(--el-text-color-secondary); font-size: 14px; }
.quick-stats { display: flex; gap: 32px; }
.stat-item { text-align: center; }
.stat-num { display: block; font-size: 28px; font-weight: 700; color: var(--el-color-primary); }
.stat-label { font-size: 12px; color: var(--el-text-color-secondary); }
</style>
