<template>
  <div class="page-container dashboard-page">
    <div class="dashboard-grid">
      <DashboardHeader />
      <div class="widgets-row">
        <TaskSummary class="widget" />
        <CalendarOverview class="widget" />
        <WeatherWidget class="widget" />
      </div>
      <StatsChart class="stats-widget" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import DashboardHeader from '@/components/Dashboard/DashboardHeader.vue'
import TaskSummary from '@/components/Dashboard/TaskSummary.vue'
import CalendarOverview from '@/components/Dashboard/CalendarOverview.vue'
import StatsChart from '@/components/Dashboard/StatsChart.vue'
import WeatherWidget from '@/components/Dashboard/WeatherWidget.vue'
</script>

<style scoped>
.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.widgets-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 0.92fr;
  gap: 18px;
}
.widget { min-width: 0; min-height: 190px; }
.stats-widget { min-height: 320px; }

@media (max-width: 1180px) {
  .widgets-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .widget:last-child { grid-column: span 2; }
}

@media (max-width: 640px) {
  .widgets-row { grid-template-columns: 1fr; }
  .widget:last-child { grid-column: auto; }
}
</style>
