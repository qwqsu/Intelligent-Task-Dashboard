<template>
  <div class="notification-settings">
    <div class="setting-row">
      <span class="setting-label">启用通知</span>
      <el-switch v-model="userStore.notificationsEnabled" />
    </div>
    <el-divider />
    <p class="setting-desc">开启后，AI 助手将在任务截止前发送提醒通知。</p>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/userStore'

const userStore = useUserStore()
</script>

<style scoped>
.notification-settings { display: flex; flex-direction: column; gap: 12px; }
.setting-row { display: flex; justify-content: space-between; align-items: center; }
.setting-label { font-size: 14px; }
.setting-desc { font-size: 12px; color: var(--el-text-color-secondary); }
</style>
