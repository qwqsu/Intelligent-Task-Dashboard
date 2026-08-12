<template>
  <el-card class="weather-card">
    <template #header>
      <div class="weather-header">
        <span>天气</span>
        <span v-if="data" class="location">{{ data.city }} · {{ data.district }}</span>
      </div>
    </template>

    <div v-if="loading" class="weather-skeleton">
      <el-skeleton :rows="2" animated />
    </div>

    <div v-else-if="fallback" class="weather-fallback">
      <span class="fallback-mark">☼</span>
      <div>
        <strong>天气暂时离线</strong>
        <p>不影响今天的计划节奏</p>
      </div>
      <el-button text size="small" @click="fetchWeather">重试</el-button>
    </div>

    <template v-else-if="data">
      <div class="weather-main">
        <span class="weather-icon">{{ weatherEmoji }}</span>
        <div class="weather-info">
          <p class="temp">{{ data.temperature }}°C</p>
          <p class="desc">{{ data.weather }}</p>
        </div>
      </div>
      <div class="weather-details">
        <span>{{ data.wind_direction }} {{ data.wind_power }}</span>
        <span>湿度 {{ data.humidity }}%</span>
      </div>
      <p class="report-time">{{ data.report_time }}</p>
    </template>
  </el-card>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

interface WeatherData {
  city: string
  district: string
  weather: string
  weather_icon: string
  temperature: number | string
  wind_direction: string
  wind_power: string
  humidity: number | string
  report_time: string
}

const data = ref<WeatherData | null>(null)
const loading = ref(false)
const fallback = ref(false)

const iconMap: Record<string, string> = {
  '100': '☀️',
  '101': '🌤️',
  '102': '🌤️',
  '103': '🌤️',
  '104': '☁️',
  '200': '🌫️',
  '201': '🌫️',
  '202': '🌫️',
  '203': '🌫️',
  '204': '🌫️',
  '300': '🌦️',
  '301': '🌧️',
  '302': '🌧️',
  '303': '🌧️',
  '304': '🌨️',
  '305': '🌧️',
  '306': '🌧️',
  '307': '🌧️',
  '308': '🌧️',
  '309': '🌧️',
  '310': '🌧️',
  '311': '🌧️',
  '312': '🌧️',
  '313': '🌧️',
  '400': '🌨️',
  '401': '❄️',
  '402': '❄️',
  '403': '❄️',
  '404': '🌨️',
  '405': '🌨️',
  '406': '🌨️',
  '407': '🌨️',
  '500': '🌫️',
  '501': '🌫️',
  '502': '🌫️',
  '503': '🌫️',
}

const weatherEmoji = computed(() => {
  if (!data.value) return '☼'
  return iconMap[String(data.value.weather_icon)] ?? '☼'
})

async function fetchWeather() {
  loading.value = true
  fallback.value = false
  try {
    const res = await axios.get('https://uapis.cn/api/v1/misc/weather', { timeout: 3000 })
    data.value = res.data
  } catch {
    data.value = null
    fallback.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchWeather)
</script>

<style scoped>
.weather-header { display: flex; justify-content: space-between; align-items: center; }
.location { font-size: 12px; color: var(--el-text-color-secondary); }
.weather-skeleton { padding: 8px 0; }
.weather-main { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
.weather-icon { font-size: 44px; line-height: 1; }
.temp { font-size: 30px; font-weight: 800; margin: 0; letter-spacing: -0.04em; }
.desc { color: var(--el-text-color-secondary); margin: 4px 0 0; }
.weather-details { display: flex; gap: 16px; font-size: 13px; color: var(--el-text-color-secondary); margin-bottom: 8px; }
.report-time { font-size: 11px; color: var(--el-text-color-placeholder); margin: 0; }
.weather-fallback { display: flex; align-items: center; gap: 12px; min-height: 66px; }
.fallback-mark { display: grid; place-items: center; width: 38px; height: 38px; color: var(--amber); font-size: 25px; border: 1px solid var(--amber-soft); border-radius: 50%; }
.weather-fallback strong { color: var(--ink-800); font-size: 14px; }
.weather-fallback p { margin: 4px 0 0; color: var(--ink-500); font-size: 12px; }
.weather-fallback .el-button { margin-left: auto; }
</style>
