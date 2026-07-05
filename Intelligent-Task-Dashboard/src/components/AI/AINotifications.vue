<template>
  <el-card header="AI 提醒">
    <div class="notifications">
      <el-timeline>
        <el-timeline-item
          v-for="item in notifications"
          :key="item.id"
          :type="item.type"
          :timestamp="item.time"
        >
          {{ item.content }}
        </el-timeline-item>
      </el-timeline>
      <el-empty v-if="!notifications.length" description="暂无提醒" :image-size="50" />
    </div>
    <el-divider />
    <p class="tip">根据任务截止日期和即将到来的日程自动生成提醒</p>
  </el-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import { useTaskStore } from '@/store/taskStore'
import { useCalendarStore } from '@/store/calendarStore'

const taskStore = useTaskStore()
const calendarStore = useCalendarStore()

const notifications = computed(() => {
  const items: { id: string; type: 'warning' | 'danger' | 'primary'; content: string; time: string }[] = []
  const now = dayjs()

  taskStore.tasks
    .filter((t) => t.status !== 'done' && t.dueDate && dayjs(t.dueDate).diff(now, 'day') <= 2)
    .forEach((t) => {
      const diff = dayjs(t.dueDate).diff(now, 'day')
      items.push({
        id: `task-${t.id}`,
        type: diff < 0 ? 'danger' : 'warning',
        content: diff < 0 ? `任务"${t.title}"已逾期` : `任务"${t.title}"将在 ${diff} 天后截止`,
        time: t.dueDate!,
      })
    })

  calendarStore.upcomingEvents.slice(0, 3).forEach((e) => {
    items.push({
      id: `event-${e.id}`,
      type: 'primary',
      content: `即将到来：${e.title}`,
      time: dayjs(e.start).format('MM/DD HH:mm'),
    })
  })

  return items
})
</script>

<style scoped>
.notifications { max-height: 300px; overflow-y: auto; }
.tip { font-size: 12px; color: var(--el-text-color-placeholder); text-align: center; }
</style>
