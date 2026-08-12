<template>
  <el-card class="dashboard-panel">
    <template #header>
      <div class="panel-heading">
        <div>
          <span class="panel-kicker">接下来</span>
          <strong>日程安排</strong>
        </div>
        <router-link to="/calendar" class="view-all">打开日历 <el-icon><ArrowRight /></el-icon></router-link>
      </div>
    </template>
    <div v-if="calendarStore.upcomingEvents.length">
      <div v-for="event in calendarStore.upcomingEvents" :key="event.id" class="event-row">
        <div class="event-dot" :style="{ background: event.color || '#409eff' }" />
        <div class="event-info">
          <span class="event-title">{{ event.title }}</span>
          <span class="event-time">{{ formatTime(event.start) }}</span>
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无近期事件" :image-size="50" />
  </el-card>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { useCalendarStore } from '@/store/calendarStore'

const calendarStore = useCalendarStore()

function formatTime(iso: string) {
  return dayjs(iso).format('MM/DD HH:mm')
}
</script>

<style scoped>
.panel-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.panel-heading strong, .panel-kicker { display: block; }
.panel-kicker { margin-bottom: 3px; color: var(--moss); font-size: 10px; font-weight: 750; letter-spacing: 0.1em; text-transform: uppercase; }
.panel-heading strong { font-size: 15px; }
.event-row { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--el-border-color-lighter); }
.event-row:last-child { border-bottom: 0; }
.event-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.event-info { display: flex; flex-direction: column; }
.event-title { font-size: 13px; font-weight: 500; }
.event-time { font-size: 12px; color: var(--el-text-color-secondary); }
.view-all { display: inline-flex; align-items: center; gap: 3px; color: var(--moss); font-size: 11px; font-weight: 700; text-decoration: none; }
</style>
