<template>
  <el-card header="任务统计" class="dashboard-panel">
    <div class="charts-row">
      <div class="chart-wrap">
        <p class="chart-title">状态分布</p>
        <v-chart class="chart" :option="pieOption" autoresize />
      </div>
      <div class="chart-wrap">
        <p class="chart-title">优先级分布</p>
        <v-chart class="chart" :option="barOption" autoresize />
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useTaskStore } from '@/store/taskStore'

use([CanvasRenderer, PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const taskStore = useTaskStore()

const pieOption = computed(() => ({
  color: ['#82b8dc', '#d59a3e', '#4e8363'],
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, itemWidth: 9, itemHeight: 9, textStyle: { color: '#5e6b66', fontSize: 11 } },
  series: [{
    type: 'pie',
    radius: ['42%', '65%'],
    center: ['50%', '42%'],
    data: [
      { name: '待办', value: taskStore.todoTasks.length },
      { name: '进行中', value: taskStore.inProgressTasks.length },
      { name: '已完成', value: taskStore.doneTasks.length },
    ],
    label: { show: false },
  }],
}))

const barOption = computed(() => ({
  color: ['#2f5d50'],
  tooltip: { trigger: 'axis' },
  grid: { left: 28, right: 12, top: 14, bottom: 34 },
  xAxis: { type: 'category', data: ['高', '中', '低'], axisLine: { lineStyle: { color: '#dedbd2' } }, axisLabel: { color: '#5e6b66' } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#ebe8df' } }, axisLabel: { color: '#8b9690' } },
  series: [{
    type: 'bar',
    data: [
      taskStore.tasks.filter((t) => t.priority === 'high').length,
      taskStore.tasks.filter((t) => t.priority === 'medium').length,
      taskStore.tasks.filter((t) => t.priority === 'low').length,
    ],
    barWidth: 18,
    itemStyle: { borderRadius: [3, 3, 0, 0] },
  }],
}))
</script>

<style scoped>
.charts-row { display: flex; gap: 16px; }
.chart-wrap { flex: 1; }
.chart-title { text-align: center; font-size: 13px; color: var(--el-text-color-secondary); margin-bottom: 4px; }
.chart { height: 240px; }
</style>
