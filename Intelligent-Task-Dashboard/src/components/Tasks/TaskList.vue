<template>
  <div class="task-list">
    <TransitionGroup name="list" tag="div">
      <TaskItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @edit="handleEdit"
        @delete="taskStore.removeTask(task.id)"
        @status-change="taskStore.updateStatus(task.id, $event)"
      />
    </TransitionGroup>
    <el-empty v-if="!filteredTasks.length" description="没有符合条件的任务" />

    <el-dialog v-model="showEdit" title="编辑任务" width="520px" destroy-on-close>
      <TaskForm :initial="editingTask" @submit="handleSubmit" @cancel="showEdit = false" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { useTaskStore } from '@/store/taskStore'
import type { Task } from '@/store/taskStore'
import TaskItem from './TaskItem.vue'
import TaskForm from './TaskForm.vue'

const props = withDefaults(defineProps<{
  filter?: string
  query?: string
  priority?: string
  scope?: 'all' | 'today' | 'overdue'
  sortBy?: 'priority' | 'due' | 'created'
}>(), {
  filter: 'all',
  query: '',
  priority: 'all',
  scope: 'all',
  sortBy: 'priority',
})

const taskStore = useTaskStore()
const showEdit = ref(false)
const editingTask = ref<Task | null>(null)

const filteredTasks = computed(() => {
  const keyword = props.query.trim().toLowerCase()
  const today = dayjs().format('YYYY-MM-DD')

  const tasks = taskStore.tasks.filter((task) => {
    if (props.filter !== 'all' && task.status !== props.filter) return false
    if (props.priority !== 'all' && task.priority !== props.priority) return false
    if (props.scope === 'today' && !task.dueDate?.startsWith(today)) return false
    if (props.scope === 'overdue' && !taskStore.overdueTasks.some((item) => item.id === task.id)) return false
    if (keyword && !`${task.title} ${task.description ?? ''}`.toLowerCase().includes(keyword)) return false
    return true
  })

  return [...tasks].sort((a, b) => {
    if (props.sortBy === 'due') {
      const aDue = a.dueDate ? dayjs(a.dueDate).valueOf() : Number.MAX_SAFE_INTEGER
      const bDue = b.dueDate ? dayjs(b.dueDate).valueOf() : Number.MAX_SAFE_INTEGER
      return aDue - bDue
    }
    if (props.sortBy === 'created') return b.createdAt.localeCompare(a.createdAt)
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    const statusOrder = { todo: 0, 'in-progress': 1, done: 2 }
    return statusOrder[a.status] - statusOrder[b.status] || priorityOrder[a.priority] - priorityOrder[b.priority]
  })
})

function handleEdit(task: Task) {
  editingTask.value = task
  showEdit.value = true
}

async function handleSubmit(data: Omit<Task, 'id' | 'createdAt'>) {
  if (editingTask.value) {
    await taskStore.updateTask({ ...editingTask.value, ...data })
  }
  showEdit.value = false
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.list-enter-from,
.list-leave-to { opacity: 0; transform: translateY(-5px); }
</style>
