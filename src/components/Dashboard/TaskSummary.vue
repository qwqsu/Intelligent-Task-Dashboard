<template>
  <el-card header="任务概览">
    <div class="task-summary">
      <el-progress
        type="circle"
        :percentage="completionRate"
        :width="80"
        :stroke-width="8"
      />
      <div class="task-list">
        <div v-for="task in recentTasks" :key="task.id" class="task-row">
          <el-tag :type="priorityType(task.priority)" size="small">{{ task.priority }}</el-tag>
          <span class="task-title">{{ task.title }}</span>
          <el-tag :type="statusType(task.status)" size="small">{{ statusLabel(task.status) }}</el-tag>
        </div>
        <el-empty v-if="!recentTasks.length" description="暂无任务" :image-size="50" />
      </div>
    </div>
    <router-link to="/tasks" class="view-all">查看全部 →</router-link>
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

const recentTasks = computed(() => taskStore.tasksByPriority.slice(0, 4))

function priorityType(p: string) {
  return p === 'high' ? 'danger' : p === 'medium' ? 'warning' : 'info'
}
function statusType(s: string) {
  return s === 'done' ? 'success' : s === 'in-progress' ? 'warning' : 'info'
}
function statusLabel(s: string) {
  return s === 'done' ? '已完成' : s === 'in-progress' ? '进行中' : '待办'
}
</script>

<style scoped>
.task-summary { display: flex; gap: 16px; align-items: flex-start; }
.task-list { flex: 1; }
.task-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
.task-title { flex: 1; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.view-all { display: block; text-align: right; margin-top: 8px; font-size: 13px; color: var(--el-color-primary); text-decoration: none; }
</style>
