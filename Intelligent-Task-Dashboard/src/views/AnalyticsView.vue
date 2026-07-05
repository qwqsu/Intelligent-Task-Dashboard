<template>
  <div class="page-container">
    <h2 class="mb-4">数据分析</h2>
    <el-row :gutter="16" class="mb-4">
      <el-col :span="8">
        <el-card>
          <el-statistic title="总任务数" :value="taskStore.tasks.length" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <el-statistic title="已完成" :value="taskStore.doneTasks.length" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <el-statistic
            title="完成率"
            :value="completionRate"
            suffix="%"
          />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-card header="任务状态分布">
          <PieChart :data="pieData" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="任务优先级分布">
          <BarChart :data="barData" />
        </el-card>
      </el-col>
    </el-row>

    <el-card header="近7天完成趋势" class="mt-4">
      <LineChart :data="lineData" />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useTaskStore } from '@/store/taskStore'
import PieChart from '@/components/Analytics/PieChart.vue'
import BarChart from '@/components/Analytics/BarChart.vue'
import LineChart from '@/components/Analytics/LineChart.vue'

const taskStore = useTaskStore()

const completionRate = computed(() => {
  if (!taskStore.tasks.length) return 0
  return Math.round((taskStore.doneTasks.length / taskStore.tasks.length) * 100)
})

const pieData = computed(() => [
  { name: '待办', value: taskStore.todoTasks.length },
  { name: '进行中', value: taskStore.inProgressTasks.length },
  { name: '已完成', value: taskStore.doneTasks.length },
])

const barData = computed(() => {
  const counts = { high: 0, medium: 0, low: 0 }
  taskStore.tasks.forEach((t) => counts[t.priority]++)
  return [
    { name: '高优先级', value: counts.high },
    { name: '中优先级', value: counts.medium },
    { name: '低优先级', value: counts.low },
  ]
})

const lineData = computed(() => {
  const days: string[] = []
  const values: number[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    days.push(dateStr.slice(5))
    values.push(taskStore.doneTasks.filter((t) => t.createdAt?.startsWith(dateStr)).length)
  }
  return { days, values }
})
</script>

<style scoped>
.mb-4 { margin-bottom: 16px; }
.mt-4 { margin-top: 16px; }
</style>
