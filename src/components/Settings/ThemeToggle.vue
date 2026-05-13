<template>
  <div class="theme-toggle">
    <p class="setting-label">当前主题：{{ userStore.theme === 'dark' ? '暗色' : '亮色' }}</p>
    <el-switch
      v-model="isDark"
      active-text="暗色"
      inactive-text="亮色"
      @change="userStore.toggleTheme()"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/userStore'

const userStore = useUserStore()
const isDark = computed(() => userStore.theme === 'dark')
</script>

<style scoped>
.theme-toggle { display: flex; flex-direction: column; gap: 12px; }
.setting-label { font-size: 14px; color: var(--el-text-color-regular); }
</style>
