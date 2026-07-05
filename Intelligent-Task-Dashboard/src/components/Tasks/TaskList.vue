<template>
  <div class="task-list">
    <TransitionGroup name="list">
      <TaskItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @edit="handleEdit"
        @delete="taskStore.removeTask(task.id)"
        @status-change="taskStore.updateStatus(task.id, $event)"
      />
    </TransitionGroup>
    <el-empty v-if="!filteredTasks.length" description="暂无任务" />

    <el-dialog v-model="showEdit" title="编辑任务" width="500px" destroy-on-close>
      <TaskForm :initial="editingTask" @submit="handleSubmit" @cancel="showEdit = false" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useTaskStore } from '@/store/taskStore'
import type { Task } from '@/store/taskStore'
import TaskItem from './TaskItem.vue'
import TaskForm from './TaskForm.vue'

const props = defineProps<{ filter?: string }>()
const taskStore = useTaskStore()
const showEdit = ref(false)
const editingTask = ref<Task | null>(null)

const filteredTasks = computed(() => {
  if (!props.filter || props.filter === 'all') return taskStore.tasksByPriority
  return taskStore.tasksByPriority.filter((t) => t.status === props.filter)
})

function handleEdit(task: Task) {
  editingTask.value = task
  showEdit.value = true
}

function handleSubmit(data: Omit<Task, 'id' | 'createdAt'>) {
  if (editingTask.value) {
    taskStore.updateTask({ ...editingTask.value, ...data })
  }
  showEdit.value = false
}
</script>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-20px); }
</style>
