<template>
  <el-card class="task-item" shadow="hover">
    <div class="task-row">
      <el-checkbox
        :model-value="task.status === 'done'"
        @change="toggleDone"
      />
      <div class="task-body">
        <span class="task-title" :class="{ done: task.status === 'done' }">{{ task.title }}</span>
        <span v-if="task.description" class="task-desc">{{ task.description }}</span>
      </div>
      <div class="task-meta">
        <el-tag :type="priorityType" size="small">{{ priorityLabel }}</el-tag>
        <el-dropdown @command="(s: Task['status']) => emit('statusChange', s)" trigger="click">
          <el-tag :type="statusType" size="small" class="status-tag">
            {{ statusLabel }} <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-tag>
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
          {{ task.dueDate }}
        </span>
      </div>
      <div class="task-actions">
        <el-button size="small" text @click="emit('edit', task)">
          <el-icon><Edit /></el-icon>
        </el-button>
        <el-popconfirm title="确认删除？" @confirm="emit('delete', task.id)">
          <template #reference>
            <el-button size="small" text type="danger">
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

const priorityType = computed(() =>
  props.task.priority === 'high' ? 'danger' : props.task.priority === 'medium' ? 'warning' : 'info'
)
const priorityLabel = computed(() =>
  props.task.priority === 'high' ? '高' : props.task.priority === 'medium' ? '中' : '低'
)
const statusType = computed(() =>
  props.task.status === 'done' ? 'success' : props.task.status === 'in-progress' ? 'warning' : 'info'
)
const statusLabel = computed(() =>
  props.task.status === 'done' ? '已完成' : props.task.status === 'in-progress' ? '进行中' : '待办'
)
const isOverdue = computed(() =>
  props.task.status !== 'done' && !!props.task.dueDate && props.task.dueDate < new Date().toISOString().slice(0, 10)
)

function toggleDone(val: CheckboxValueType) {
  emit('statusChange', val ? 'done' : 'todo')
}
</script>

<style scoped>
.task-item {
  margin-bottom: 8px;
  border: 1.5px solid transparent !important;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease !important;
}
.task-item:hover {
  border-color: #ffb3c6 !important;
  box-shadow: 0 4px 18px rgba(255, 100, 130, 0.15) !important;
  transform: translateY(-2px);
}
.task-row { display: flex; align-items: center; gap: 12px; }
.task-body { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.task-title { font-size: 14px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.task-title.done { text-decoration: line-through; color: var(--el-text-color-placeholder); }
.task-desc { font-size: 12px; color: var(--el-text-color-secondary); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.task-meta { display: flex; gap: 6px; align-items: center; flex-shrink: 0; }
.status-tag { cursor: pointer; display: flex; align-items: center; gap: 2px; }
.due-date { font-size: 12px; color: var(--el-text-color-secondary); white-space: nowrap; }
.due-date.overdue { color: var(--el-color-danger); font-weight: 500; }
.task-actions { display: flex; gap: 4px; flex-shrink: 0; }
</style>
