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
  xAxis: { type: 'category', data: props.data.map((d) => d.name) },
  yAxis: { type: 'value', minInterval: 1 },
  series: [{
    type: 'bar',
    data: props.data.map((d) => d.value),
    itemStyle: { color: '#67c23a' },
  }],
}))
</script>

<style scoped>
.chart { height: 240px; width: 100%; }
</style>
