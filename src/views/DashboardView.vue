<template>
  <div class="page-container">
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
  gap: 20px;
}
.widgets-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.widget { min-height: 160px; }
.stats-widget { min-height: 320px; }
</style>
