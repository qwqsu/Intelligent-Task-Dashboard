<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent])

const props = defineProps<{
  data: { days: string[]; values: number[] }
}>()

const option = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 22, right: 16, top: 18, bottom: 28 },
  xAxis: { type: 'category', data: props.data.days, boundaryGap: false, axisLine: { lineStyle: { color: '#dedbd2' } }, axisLabel: { color: '#5e6b66' } },
  yAxis: { type: 'value', minInterval: 1, splitLine: { lineStyle: { color: '#ebe8df' } }, axisLabel: { color: '#8b9690' } },
  series: [{
    type: 'line',
    data: props.data.values,
    smooth: false,
    symbolSize: 7,
    itemStyle: { color: '#e8725c' },
    lineStyle: { color: '#e8725c', width: 2 },
  }],
}))
</script>

<style scoped>
.chart { height: 240px; width: 100%; }
</style>
