<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])

const props = defineProps<{
  data: { name: string; value: number }[]
}>()

const option = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 22, right: 12, top: 16, bottom: 28 },
  xAxis: { type: 'category', data: props.data.map((d) => d.name), axisLine: { lineStyle: { color: '#dedbd2' } }, axisLabel: { color: '#5e6b66' } },
  yAxis: { type: 'value', minInterval: 1, splitLine: { lineStyle: { color: '#ebe8df' } }, axisLabel: { color: '#8b9690' } },
  series: [{
    type: 'bar',
    data: props.data.map((d) => d.value),
    barWidth: 24,
    itemStyle: { color: '#2f5d50', borderRadius: [3, 3, 0, 0] },
  }],
}))
</script>

<style scoped>
.chart { height: 240px; width: 100%; }
</style>
