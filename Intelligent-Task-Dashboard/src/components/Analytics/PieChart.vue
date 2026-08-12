<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent])

const props = defineProps<{
  data: { name: string; value: number }[]
}>()

const option = computed(() => ({
  color: ['#82b8dc', '#d59a3e', '#4e8363'],
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, itemWidth: 9, itemHeight: 9, textStyle: { color: '#5e6b66', fontSize: 11 } },
  series: [{
    type: 'pie',
    radius: ['43%', '67%'],
    data: props.data,
    label: { show: false },
  }],
}))
</script>

<style scoped>
.chart { height: 240px; width: 100%; }
</style>
