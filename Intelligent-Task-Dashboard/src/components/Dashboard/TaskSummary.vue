<template>
  <el-card class="dashboard-panel">
    <template #header>
      <div class="panel-heading">
        <div>
          <span class="panel-kicker">任务</span>
          <strong>把今天排好</strong>
        </div>
        <router-link to="/tasks" class="view-all">查看全部 <el-icon><ArrowRight /></el-icon></router-link>
      </div>
    </template>
    <div class="summary-top">
      <div>
        <span class="summary-number">{{ taskStore.todoTasks.length }}</span>
        <span class="summary-label">个待办任务</span>
      </div>
      <span class="summary-caption">{{ taskStore.todayTasks.length ? '今日安排' : '全部待办' }}</span>
    </div>
    <el-progress :percentage="completionRate" :show-text="false" :stroke-width="7" />
    <div class="task-summary">
      <div class="task-list">
        <div v-for="task in recentTasks" :key="task.id" class="task-row">
          <span class="priority-dot" :class="task.priority" />
          <span class="task-title">{{ task.title }}</span>
          <span class="task-status" :class="task.status">{{ statusLabel(task.status) }}</span>
        </div>
        <el-empty v-if="!recentTasks.length" description="暂无任务" :image-size="50" />
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useTaskStore } from '@/store/taskStore'

const taskStore = useTaskStore()

const completionRate = computed(() => {
  if (!taskStore.tasks.length) return 0
  return Math.round((taskStore.doneTasks.length / taskStore.tasks.length) * 100)
})

const recentTasks = computed(() => {
  const todayTasks = taskStore.todayTasks
  return (todayTasks.length ? todayTasks : taskStore.tasksByPriority).slice(0, 4)
})

function statusLabel(s: string) {
  return s === 'done' ? '已完成' : s === 'in-progress' ? '进行中' : '待办'
}
</script>

<style scoped>
.panel-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.panel-heading strong, .panel-kicker { display: block; }
.panel-kicker { margin-bottom: 3px; color: var(--moss); font-size: 10px; font-weight: 750; letter-spacing: 0.1em; text-transform: uppercase; }
.panel-heading strong { font-size: 15px; }
.summary-top { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 10px; }
.summary-number { color: var(--ink-950); font-size: 30px; font-weight: 800; letter-spacing: -0.05em; }
.summary-label, .summary-caption { margin-left: 7px; color: var(--el-text-color-secondary); font-size: 12px; }
.summary-caption { margin-left: 0; }
.task-summary { display: flex; gap: 16px; align-items: flex-start; margin-top: 16px; }
.task-list { flex: 1; }
.task-row {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
.task-row:last-child { border-bottom: 0; }
.priority-dot { width: 7px; height: 7px; flex-shrink: 0; background: var(--sky); border-radius: 50%; }
.priority-dot.high { background: var(--coral); }
.priority-dot.medium { background: var(--amber); }
.priority-dot.low { background: var(--sky); }
.task-title { flex: 1; overflow: hidden; color: var(--ink-800); font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
.task-status { color: var(--el-text-color-secondary); font-size: 11px; }
.task-status.done { color: var(--el-color-success); }
.task-status.in-progress { color: var(--moss); }
.view-all { display: inline-flex; align-items: center; gap: 3px; color: var(--moss); font-size: 11px; font-weight: 700; text-decoration: none; }

</style>
