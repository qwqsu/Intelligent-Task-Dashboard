<template>
  <div class="layout-selector">
    <p class="setting-label">布局模式</p>
    <el-radio-group :model-value="userStore.compactLayout" @change="handleLayoutChange">
      <el-radio :value="false">标准</el-radio>
      <el-radio :value="true">紧凑</el-radio>
    </el-radio-group>
    <p class="setting-desc">紧凑模式会减少页面留白，适合一次处理更多任务。</p>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/userStore'

const userStore = useUserStore()

function handleLayoutChange(value: string | number | boolean | undefined) {
  userStore.setCompactLayout(value === true)
}
</script>

<style scoped>
.layout-selector { display: flex; flex-direction: column; gap: 12px; }
.setting-label { font-size: 14px; color: var(--el-text-color-regular); }
.setting-desc { color: var(--el-text-color-secondary); font-size: 12px; line-height: 1.5; }
</style>
