<template>
  <el-card header="近期事件">
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
    <router-link to="/calendar" class="view-all">查看日历 →</router-link>
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
.event-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid var(--el-border-color-lighter); }
.event-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.event-info { display: flex; flex-direction: column; }
.event-title { font-size: 13px; font-weight: 500; }
.event-time { font-size: 12px; color: var(--el-text-color-secondary); }
.view-all { display: block; text-align: right; margin-top: 8px; font-size: 13px; color: var(--el-color-primary); text-decoration: none; }
</style>
