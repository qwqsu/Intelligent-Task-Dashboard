<template>
  <div class="layout-selector">
    <p class="setting-label">布局模式</p>
    <el-radio-group v-model="userStore.compactLayout">
      <el-radio :value="false">标准</el-radio>
      <el-radio :value="true">紧凑</el-radio>
    </el-radio-group>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/userStore'

const userStore = useUserStore()
</script>

<style scoped>
.layout-selector { display: flex; flex-direction: column; gap: 12px; }
.setting-label { font-size: 14px; color: var(--el-text-color-regular); }
</style>
