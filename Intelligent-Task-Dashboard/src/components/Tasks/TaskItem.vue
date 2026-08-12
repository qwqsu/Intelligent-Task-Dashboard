<template>
  <el-card class="task-item" :class="{ completed: task.status === 'done', overdue: isOverdue }">
    <div class="task-row">
      <el-checkbox
        :model-value="task.status === 'done'"
        :aria-label="`标记任务 ${task.title}`"
        @change="toggleDone"
      />
      <div class="task-body">
        <span class="task-title" :class="{ done: task.status === 'done' }">{{ task.title }}</span>
        <span v-if="task.description" class="task-desc">{{ task.description }}</span>
        <div class="task-meta">
          <span class="priority-label" :class="task.priority">{{ priorityLabel }}</span>
          <span class="meta-separator">·</span>
          <el-dropdown @command="handleStatusChange" trigger="click">
            <button class="status-button" type="button" :class="task.status">
              {{ statusLabel }} <el-icon><ArrowDown /></el-icon>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="opt in statusOptions"
                  :key="opt.value"
                  :command="opt.value"
                  :disabled="opt.value === task.status"
                >
                  <el-icon><component :is="opt.icon" /></el-icon>
                  {{ opt.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span v-if="task.dueDate" class="due-date" :class="{ overdue: isOverdue }">
            <el-icon><Calendar /></el-icon>{{ dueLabel }}
          </span>
        </div>
      </div>
      <div class="task-actions">
        <el-button size="small" text aria-label="编辑任务" @click="emit('edit', task)">
          <el-icon><Edit /></el-icon>
        </el-button>
        <el-popconfirm title="确认删除这个任务？" @confirm="emit('delete', task.id)">
          <template #reference>
            <el-button size="small" text type="danger" aria-label="删除任务">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import type { CheckboxValueType } from 'element-plus'
import type { Task } from '@/store/taskStore'

const props = defineProps<{ task: Task }>()
const emit = defineEmits<{
  edit: [task: Task]
  delete: [id: number]
  statusChange: [status: Task['status']]
}>()

const statusOptions: { value: Task['status']; label: string; icon: string }[] = [
  { value: 'todo', label: '待办', icon: 'Clock' },
  { value: 'in-progress', label: '进行中', icon: 'Loading' },
  { value: 'done', label: '已完成', icon: 'CircleCheck' },
]

const priorityLabel = computed(() =>
  props.task.priority === 'high' ? '高优先' : props.task.priority === 'medium' ? '中优先' : '低优先',
)
const statusLabel = computed(() =>
  props.task.status === 'done' ? '已完成' : props.task.status === 'in-progress' ? '进行中' : '待办',
)
const isOverdue = computed(() =>
  props.task.status !== 'done' && !!props.task.dueDate && dayjs(props.task.dueDate).isBefore(dayjs(), 'day'),
)
const dueLabel = computed(() => {
  if (!props.task.dueDate) return ''
  const due = dayjs(props.task.dueDate)
  if (due.isSame(dayjs(), 'day')) return '今天截止'
  if (due.isSame(dayjs().add(1, 'day'), 'day')) return '明天截止'
  return `${due.format('M月D日')}${props.task.dueDate.includes(':') ? ` ${due.format('HH:mm')}` : ''}`
})

function toggleDone(value: CheckboxValueType) {
  emit('statusChange', value ? 'done' : 'todo')
}

function handleStatusChange(status: Task['status']) {
  emit('statusChange', status)
}
</script>

<style scoped>
.task-item {
  margin-bottom: 9px;
  border-left: 3px solid var(--sky) !important;
}

.task-item:has(.priority-label.high) { border-left-color: var(--coral) !important; }
.task-item:has(.priority-label.medium) { border-left-color: var(--amber) !important; }
.task-item.completed { opacity: 0.76; }
.task-item.overdue { border-left-color: var(--coral) !important; }
.task-row { display: flex; align-items: flex-start; gap: 12px; }
.task-body { flex: 1; min-width: 0; }
.task-title { display: block; overflow: hidden; color: var(--ink-950); font-size: 14px; font-weight: 700; line-height: 1.4; text-overflow: ellipsis; white-space: nowrap; }
.task-title.done { color: var(--ink-400); text-decoration: line-through; }
.task-desc { display: block; overflow: hidden; margin-top: 4px; color: var(--ink-600); font-size: 12px; line-height: 1.4; text-overflow: ellipsis; white-space: nowrap; }
.task-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; margin-top: 10px; }
.priority-label { font-size: 11px; font-weight: 750; }
.priority-label.high { color: var(--coral); }
.priority-label.medium { color: var(--amber); }
.priority-label.low { color: var(--sky); }
.meta-separator { color: var(--line-strong); }
.status-button { display: inline-flex; align-items: center; gap: 3px; padding: 0; background: transparent; border: 0; color: var(--ink-600); cursor: pointer; font-size: 11px; }
.status-button:hover { color: var(--moss); }
.status-button.done { color: var(--el-color-success); }
.status-button.in-progress { color: var(--moss); }
.due-date { display: inline-flex; align-items: center; gap: 3px; color: var(--ink-600); font-size: 11px; }
.due-date.overdue { color: var(--coral); font-weight: 700; }
.task-actions { display: flex; flex-shrink: 0; gap: 2px; }

@media (max-width: 500px) {
  .task-row { gap: 8px; }
  .task-actions { flex-direction: column; }
}
</style>
