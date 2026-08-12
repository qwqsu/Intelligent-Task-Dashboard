<template>
  <div class="page-container analytics-page">
    <div class="page-heading">
      <div>
        <p class="eyebrow">回看与调整</p>
        <h1>复盘</h1>
        <p>数据不是考核，是帮你找到更适合自己的节奏。</p>
      </div>
      <span class="period-label">最近 7 天</span>
    </div>

    <div class="metric-grid">
      <div class="metric-item">
        <span class="metric-label">全部任务</span>
        <strong>{{ taskStore.tasks.length }}</strong>
        <span class="metric-note">当前收集箱</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">完成率</span>
        <strong class="moss">{{ completionRate }}%</strong>
        <span class="metric-note">已完成 {{ taskStore.doneTasks.length }} 项</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">本周完成</span>
        <strong class="coral">{{ weekCompleted }}</strong>
        <span class="metric-note">以完成时间统计</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">需要关注</span>
        <strong class="amber">{{ taskStore.overdueTasks.length }}</strong>
        <span class="metric-note">逾期未完成</span>
      </div>
    </div>

    <div class="chart-grid">
      <el-card>
        <template #header><span>任务状态</span></template>
        <PieChart :data="pieData" />
      </el-card>
      <el-card>
        <template #header><span>优先级分布</span></template>
        <BarChart :data="barData" />
      </el-card>
    </div>

    <el-card class="trend-card">
      <template #header>
        <div class="trend-heading">
          <span>完成节奏</span>
          <small>记录任务从“进行中”到“已完成”的时间</small>
        </div>
      </template>
      <LineChart :data="lineData" />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import { useTaskStore } from '@/store/taskStore'
import PieChart from '@/components/Analytics/PieChart.vue'
import BarChart from '@/components/Analytics/BarChart.vue'
import LineChart from '@/components/Analytics/LineChart.vue'

const taskStore = useTaskStore()

const completionRate = computed(() => {
  if (!taskStore.tasks.length) return 0
  return Math.round((taskStore.doneTasks.length / taskStore.tasks.length) * 100)
})

const weekCompleted = computed(() => {
  const weekStart = dayjs().startOf('week')
  return taskStore.doneTasks.filter((task) => dayjs(task.completedAt ?? task.createdAt).isAfter(weekStart)).length
})

const pieData = computed(() => [
  { name: '待办', value: taskStore.todoTasks.length },
  { name: '进行中', value: taskStore.inProgressTasks.length },
  { name: '已完成', value: taskStore.doneTasks.length },
])

const barData = computed(() => {
  const counts = { high: 0, medium: 0, low: 0 }
  taskStore.tasks.forEach((task) => counts[task.priority]++)
  return [
    { name: '高', value: counts.high },
    { name: '中', value: counts.medium },
    { name: '低', value: counts.low },
  ]
})

const lineData = computed(() => {
  const days: string[] = []
  const values: number[] = []
  for (let i = 6; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day')
    const dateStr = date.format('YYYY-MM-DD')
    days.push(date.format('M/D'))
    values.push(
      taskStore.doneTasks.filter((task) => (task.completedAt ?? task.createdAt).startsWith(dateStr)).length,
    )
  }
  return { days, values }
})
</script>

<style scoped>
.period-label { padding: 7px 10px; background: var(--surface-muted); border: 1px solid var(--el-border-color-light); color: var(--ink-600); font-size: 11px; }
.metric-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin-bottom: 22px; border-top: 1px solid var(--el-border-color-light); border-bottom: 1px solid var(--el-border-color-light); }
.metric-item { padding: 18px 20px; border-right: 1px solid var(--el-border-color-light); }
.metric-item:last-child { border-right: 0; }
.metric-label, .metric-note { display: block; color: var(--ink-600); font-size: 11px; }
.metric-item strong { display: block; margin: 6px 0 4px; color: var(--ink-950); font-size: 27px; font-weight: 800; letter-spacing: -0.04em; }
.metric-item strong.moss { color: var(--moss); }
.metric-item strong.coral { color: var(--coral); }
.metric-item strong.amber { color: var(--amber); }
.metric-note { color: var(--ink-400); font-size: 10px; }
.chart-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.trend-card { margin-top: 18px; }
.trend-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.trend-heading small { color: var(--ink-400); font-size: 10px; font-weight: 400; }

@media (max-width: 720px) {
  .metric-grid { grid-template-columns: repeat(2, 1fr); }
  .metric-item:nth-child(2) { border-right: 0; }
  .metric-item:nth-child(-n + 2) { border-bottom: 1px solid var(--el-border-color-light); }
  .chart-grid { grid-template-columns: 1fr; }
}
</style>
