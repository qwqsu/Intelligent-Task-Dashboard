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
  xAxis: { type: 'category', data: props.data.days },
  yAxis: { type: 'value', minInterval: 1 },
  series: [{
    type: 'line',
    data: props.data.values,
    smooth: true,
    areaStyle: { opacity: 0.3 },
    itemStyle: { color: '#409eff' },
  }],
}))
</script>

<style scoped>
.chart { height: 240px; width: 100%; }
</style>
