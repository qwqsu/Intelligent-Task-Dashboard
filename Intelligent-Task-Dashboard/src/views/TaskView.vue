<template>
  <div class="page-container task-page">
    <div class="page-heading">
      <div>
        <p class="eyebrow">收集箱</p>
        <h1>任务</h1>
        <p>先把事情放下来，再决定下一步怎么做。</p>
      </div>
      <el-button type="primary" @click="openNewTask">
        <el-icon><Plus /></el-icon>
        新建任务
      </el-button>
    </div>

    <div class="task-overview" aria-label="任务概览">
      <button class="overview-item" type="button" @click="selectTab('all')">
        <span class="overview-value">{{ taskStore.tasks.length }}</span>
        <span class="overview-label">全部任务</span>
      </button>
      <button class="overview-item" type="button" @click="selectTab('todo')">
        <span class="overview-value moss">{{ taskStore.todoTasks.length }}</span>
        <span class="overview-label">待办</span>
      </button>
      <button class="overview-item" type="button" @click="selectTab('in-progress')">
        <span class="overview-value amber">{{ taskStore.inProgressTasks.length }}</span>
        <span class="overview-label">进行中</span>
      </button>
      <button class="overview-item" type="button" @click="selectScope('overdue')">
        <span class="overview-value coral">{{ taskStore.overdueTasks.length }}</span>
        <span class="overview-label">已逾期</span>
      </button>
    </div>

    <div class="task-toolbar">
      <el-input v-model="query" clearable class="task-search" placeholder="搜索任务标题或描述">
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-select v-model="priorityFilter" class="filter-select" placeholder="优先级">
        <el-option label="全部优先级" value="all" />
        <el-option label="高优先级" value="high" />
        <el-option label="中优先级" value="medium" />
        <el-option label="低优先级" value="low" />
      </el-select>
      <el-select v-model="sortBy" class="filter-select" placeholder="排序">
        <el-option label="按优先级" value="priority" />
        <el-option label="按截止时间" value="due" />
        <el-option label="按创建时间" value="created" />
      </el-select>
      <el-button text @click="resetFilters">重置</el-button>
    </div>

    <el-tabs v-model="activeTab" class="task-tabs">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane label="待办" name="todo" />
      <el-tab-pane label="进行中" name="in-progress" />
      <el-tab-pane label="已完成" name="done" />
    </el-tabs>

    <div class="scope-row">
      <span class="scope-label">查看范围</span>
      <el-radio-group v-model="scope" size="small">
        <el-radio-button value="all">全部</el-radio-button>
        <el-radio-button value="today">今天</el-radio-button>
        <el-radio-button value="overdue">逾期</el-radio-button>
      </el-radio-group>
      <span class="result-count">{{ resultHint }}</span>
    </div>

    <AIPrioritySuggestion v-if="activeTab === 'all' && taskStore.tasks.length > 0" class="priority-suggestion" />
    <TaskList
      :filter="activeTab"
      :query="query"
      :priority="priorityFilter"
      :scope="scope"
      :sort-by="sortBy"
    />

    <el-dialog v-model="showForm" title="新建任务" width="520px" destroy-on-close>
      <TaskForm @submit="handleSubmit" @cancel="showForm = false" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/store/taskStore'
import type { Task } from '@/store/taskStore'
import TaskList from '@/components/Tasks/TaskList.vue'
import TaskForm from '@/components/Tasks/TaskForm.vue'
import AIPrioritySuggestion from '@/components/Tasks/AIPrioritySuggestion.vue'

type Scope = 'all' | 'today' | 'overdue'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const showForm = ref(false)
const activeTab = ref<Task['status'] | 'all'>('all')
const query = ref('')
const priorityFilter = ref<Task['priority'] | 'all'>('all')
const sortBy = ref<'priority' | 'due' | 'created'>('priority')
const scope = ref<Scope>(route.query.scope === 'today' || route.query.scope === 'overdue' ? route.query.scope : 'all')

const resultHint = computed(() => {
  const scopeLabel = scope.value === 'today' ? '今天' : scope.value === 'overdue' ? '逾期' : '全部'
  return `${scopeLabel} · 可见任务由筛选条件决定`
})

watch(
  () => route.query.new,
  (value) => {
    if (value === '1') {
      showForm.value = true
      void router.replace({ path: route.path, query: { ...route.query, new: undefined } })
    }
  },
  { immediate: true },
)

watch(
  () => route.query.scope,
  (value) => {
    if (value === 'today' || value === 'overdue') {
      scope.value = value
      activeTab.value = 'all'
    } else if (value === undefined) {
      scope.value = 'all'
    }
  },
)

function openNewTask() {
  showForm.value = true
}

function selectTab(tab: Task['status'] | 'all') {
  activeTab.value = tab
  scope.value = 'all'
}

function selectScope(nextScope: Scope) {
  scope.value = nextScope
  if (nextScope !== 'all') activeTab.value = 'all'
}

function resetFilters() {
  query.value = ''
  priorityFilter.value = 'all'
  sortBy.value = 'priority'
  scope.value = 'all'
}

async function handleSubmit(data: Omit<Task, 'id' | 'createdAt'>) {
  await taskStore.addTask(data)
  showForm.value = false
}
</script>

<style scoped>
.task-overview {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 24px;
  border-top: 1px solid var(--el-border-color-light);
  border-bottom: 1px solid var(--el-border-color-light);
}

.overview-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 16px 20px;
  background: transparent;
  border: 0;
  border-right: 1px solid var(--el-border-color-light);
  cursor: pointer;
  text-align: left;
}

.overview-item:last-child { border-right: 0; }
.overview-item:hover { background: var(--surface-muted); }
.overview-value { color: var(--ink-950); font-size: 24px; font-weight: 800; letter-spacing: -0.04em; }
.overview-value.moss { color: var(--moss); }
.overview-value.amber { color: var(--amber); }
.overview-value.coral { color: var(--coral); }
.overview-label { color: var(--ink-600); font-size: 11px; }

.task-toolbar {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 15px;
}

.task-search { flex: 1; min-width: 220px; }
.filter-select { width: 145px; }
.task-tabs { margin-bottom: 0; }
.scope-row { display: flex; align-items: center; gap: 12px; padding: 14px 0 12px; border-bottom: 1px solid var(--el-border-color-light); }
.scope-label { color: var(--ink-600); font-size: 12px; font-weight: 650; }
.result-count { margin-left: auto; color: var(--ink-400); font-size: 11px; }
.priority-suggestion { margin: 18px 0; }

@media (max-width: 720px) {
  .task-overview { grid-template-columns: repeat(2, 1fr); }
  .overview-item:nth-child(2) { border-right: 0; }
  .overview-item:nth-child(-n + 2) { border-bottom: 1px solid var(--el-border-color-light); }
  .task-toolbar { flex-wrap: wrap; }
  .task-search { flex-basis: 100%; }
  .filter-select { flex: 1; width: auto; }
}

@media (max-width: 460px) {
  .scope-row { align-items: flex-start; flex-wrap: wrap; }
  .result-count { flex-basis: 100%; margin-left: 0; }
}
</style>
