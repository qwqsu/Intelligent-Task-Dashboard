<template>
  <!-- 登录页单独渲染，不带侧边栏 -->
  <router-view v-if="route.meta.public" />

  <el-container v-else class="app-layout">
    <el-aside width="220px" class="app-sidebar">
      <div class="sidebar-logo">
        <el-icon size="28"><DataAnalysis /></el-icon>
        <span>智能任务仪表盘</span>
      </div>
      <el-menu
        :default-active="activeRoute"
        router
        class="sidebar-menu"
        :collapse="false"
      >
        <el-menu-item index="/dashboard">
          <el-icon><House /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/tasks">
          <el-icon><List /></el-icon>
          <span>任务管理</span>
        </el-menu-item>
        <el-menu-item index="/calendar">
          <el-icon><Calendar /></el-icon>
          <span>日程管理</span>
        </el-menu-item>
        <el-menu-item index="/ai-assistant">
          <el-icon><ChatDotRound /></el-icon>
          <span>AI 助手</span>
        </el-menu-item>
        <el-menu-item index="/analytics">
          <el-icon><TrendCharts /></el-icon>
          <span>数据分析</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container class="app-main-container">
      <el-header class="app-header">
        <div class="header-left">
          <span class="page-title">{{ currentTitle }}</span>
        </div>
        <div class="header-right">
          <el-tooltip :content="userStore.theme === 'dark' ? '切换亮色' : '切换暗色'">
            <el-button circle size="default" @click="userStore.toggleTheme()">
              <el-icon size="18"><Sunny v-if="userStore.theme === 'dark'" /><Moon v-else /></el-icon>
            </el-button>
          </el-tooltip>
          <el-avatar
            :size="36"
            class="ml-2 user-avatar"
            :src="userStore.avatar || undefined"
            @click="router.push('/settings')"
          >{{ userStore.name[0] }}</el-avatar>
          <el-tooltip content="退出登录">
            <el-button circle size="default" text @click="handleLogout">
              <el-icon size="18"><SwitchButton /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </el-header>

      <el-main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/userStore'
import { useTaskStore } from '@/store/taskStore'
import { useCalendarStore } from '@/store/calendarStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const taskStore = useTaskStore()
const calendarStore = useCalendarStore()

const activeRoute = computed(() => route.path)
const currentTitle = computed(() => (route.meta.title as string) ?? '智能任务仪表盘')

onMounted(() => {
  taskStore.fetchTasks()
  calendarStore.fetchEvents()
})

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-layout {
  height: 100vh;
  overflow: hidden;
}

.app-sidebar {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
}

html.dark .app-sidebar {
  background: rgba(21, 35, 54, 0.7);
  border-right-color: rgba(255, 255, 255, 0.06);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px;
  font-size: 18px;
  font-weight: 700;
  color: var(--el-color-primary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.sidebar-menu {
  flex: 1;
  border-right: none;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0 24px;
}

html.dark .app-header {
  background: rgba(21, 35, 54, 0.65);
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.2);
}

.app-main {
  background: transparent;
  overflow-y: auto;
}

.fade-enter-active {
  transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(16px) scale(0.98);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
