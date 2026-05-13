<template>
  <div class="page-container">
    <div class="task-header">
      <h2>任务管理</h2>
      <el-button type="primary" @click="showForm = true">
        <el-icon><Plus /></el-icon> 新建任务
      </el-button>
    </div>

    <el-tabs v-model="activeTab" class="task-tabs">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane label="待办" name="todo" />
      <el-tab-pane label="进行中" name="in-progress" />
      <el-tab-pane label="已完成" name="done" />
    </el-tabs>

    <AIPrioritySuggestion v-if="activeTab === 'all' && taskStore.tasks.length > 0" class="mb-4" />
    <TaskList :filter="activeTab" />

    <el-dialog v-model="showForm" title="新建任务" width="500px" destroy-on-close>
      <TaskForm @submit="handleSubmit" @cancel="showForm = false" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useTaskStore } from '@/store/taskStore'
import type { Task } from '@/store/taskStore'
import TaskList from '@/components/Tasks/TaskList.vue'
import TaskForm from '@/components/Tasks/TaskForm.vue'
import AIPrioritySuggestion from '@/components/Tasks/AIPrioritySuggestion.vue'

const taskStore = useTaskStore()
const showForm = ref(false)
const activeTab = ref('all')

async function handleSubmit(data: Omit<Task, 'id' | 'createdAt'>) {
  await taskStore.addTask(data)
  showForm.value = false
}
</script>

<style scoped>
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.task-tabs { margin-bottom: 16px; }
.mb-4 { margin-bottom: 16px; }
</style>
