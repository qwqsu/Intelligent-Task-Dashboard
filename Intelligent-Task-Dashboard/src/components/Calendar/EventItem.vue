<template>
  <div class="event-item">
    <div class="event-color-bar" :style="{ background: event.color || '#409eff' }" />
    <div class="event-content">
      <span class="event-title">{{ event.title }}</span>
      <span class="event-time">{{ formatTime(event.start) }} - {{ formatTime(event.end) }}</span>
      <span v-if="event.description" class="event-desc">{{ event.description }}</span>
    </div>
    <div class="event-actions">
      <el-button size="small" text @click="emit('edit', event)"><el-icon><Edit /></el-icon></el-button>
      <el-popconfirm title="确认删除？" @confirm="emit('delete', event.id)">
        <template #reference>
          <el-button size="small" text type="danger"><el-icon><Delete /></el-icon></el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import type { CalendarEvent } from '@/store/calendarStore'

const props = defineProps<{ event: CalendarEvent }>()
const emit = defineEmits<{ edit: [event: CalendarEvent]; delete: [id: number] }>()

function formatTime(iso: string) {
  return dayjs(iso).format('HH:mm')
}
</script>

<style scoped>
.event-item {
  display: flex;
  align-items: stretch;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
.event-color-bar { width: 4px; border-radius: 2px; flex-shrink: 0; }
.event-content { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.event-title { font-size: 14px; font-weight: 500; }
.event-time { font-size: 12px; color: var(--el-text-color-secondary); }
.event-desc { font-size: 12px; color: var(--el-text-color-placeholder); }
.event-actions { display: flex; align-items: center; gap: 4px; }
</style>
