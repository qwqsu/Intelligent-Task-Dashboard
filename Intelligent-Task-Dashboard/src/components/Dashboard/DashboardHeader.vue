<template>
  <el-card class="dashboard-header">
    <div class="header-content">
      <div class="greeting">
        <p class="eyebrow">今日节奏</p>
        <h1>{{ greeting }}，{{ userStore.name }}</h1>
        <p class="date-text">{{ dateText }}</p>
        <p class="subline">把注意力留给今天最重要的那一件事。</p>
      </div>
      <div class="header-focus">
        <div class="focus-copy">
          <span class="focus-label">今日完成度</span>
          <strong>{{ taskStore.todayCompletion }}%</strong>
        </div>
        <el-progress :percentage="taskStore.todayCompletion" :show-text="false" :stroke-width="7" />
        <router-link to="/tasks?scope=today" class="focus-link">打开今日清单 <el-icon><ArrowRight /></el-icon></router-link>
      </div>
      <div class="quick-stats">
        <div class="stat-item">
          <span class="stat-num">{{ taskStore.todoTasks.length }}</span>
          <span class="stat-label">待办</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ taskStore.inProgressTasks.length }}</span>
          <span class="stat-label">进行中</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ calendarStore.todayEvents.length }}</span>
          <span class="stat-label">今日安排</span>
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
  gap: 28px;
}
.greeting { flex: 1; min-width: 220px; }
.greeting h1 { margin-bottom: 5px; font-size: 26px; letter-spacing: -0.04em; }
.date-text { color: var(--el-text-color-secondary); font-size: 13px; }
.subline { margin-top: 14px; color: var(--ink-600); font-size: 12px; }
.header-focus { width: 190px; padding-left: 20px; border-left: 1px solid var(--el-border-color-light); }
.focus-copy { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 9px; }
.focus-label { color: var(--el-text-color-secondary); font-size: 12px; }
.focus-copy strong { color: var(--moss); font-size: 22px; }
.focus-link { display: flex; align-items: center; gap: 3px; margin-top: 10px; color: var(--moss); font-size: 11px; font-weight: 700; text-decoration: none; }
.quick-stats { display: flex; gap: 25px; padding-left: 24px; border-left: 1px solid var(--el-border-color-light); }
.stat-item { min-width: 52px; text-align: left; }
.stat-num { display: block; color: var(--ink-950); font-size: 25px; font-weight: 750; letter-spacing: -0.04em; }
.stat-label { display: block; margin-top: 3px; color: var(--el-text-color-secondary); font-size: 11px; }

@media (max-width: 780px) {
  .header-content { align-items: flex-start; flex-wrap: wrap; }
  .header-focus { width: 190px; padding-left: 0; border-left: 0; }
  .quick-stats { margin-left: auto; padding-left: 18px; }
}

@media (max-width: 560px) {
  .header-focus { width: 100%; }
  .quick-stats { width: 100%; justify-content: space-between; margin-left: 0; padding: 16px 0 0; border-top: 1px solid var(--el-border-color-light); border-left: 0; }
}
</style>
