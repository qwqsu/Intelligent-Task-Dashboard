<template>
  <router-view v-if="route.meta.public" />

  <el-container v-else class="app-layout" :class="{ 'compact-layout': userStore.compactLayout }">
    <el-aside width="244px" class="app-sidebar">
      <div class="brand-lockup">
        <div class="brand-mark">D</div>
        <div>
          <strong>DAYFLOW</strong>
          <span>个人规划台</span>
        </div>
      </div>

      <div class="sidebar-section-label">工作区</div>
      <el-menu :default-active="activeRoute" router class="sidebar-menu">
        <el-menu-item v-for="item in navItems" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
          <span v-if="item.path === '/tasks' && taskStore.todoTasks.length" class="menu-count">
            {{ taskStore.todoTasks.length }}
          </span>
        </el-menu-item>
      </el-menu>

      <div class="sidebar-footer">
        <button class="sidebar-user" type="button" @click="router.push('/settings')">
          <el-avatar :size="34" :src="userStore.avatar || undefined">
            {{ userInitial }}
          </el-avatar>
          <span class="sidebar-user-copy">
            <strong>{{ userStore.name }}</strong>
            <small>我的空间</small>
          </span>
          <el-icon><ArrowRight /></el-icon>
        </button>
        <button class="sidebar-theme" type="button" @click="userStore.toggleTheme()">
          <el-icon><Sunny v-if="userStore.theme === 'dark'" /><Moon v-else /></el-icon>
          <span>{{ userStore.theme === 'dark' ? '切换亮色' : '切换暗色' }}</span>
        </button>
      </div>
    </el-aside>

    <el-container class="app-main-container">
      <el-header class="app-header">
        <div class="header-context">
          <span class="header-kicker">我的工作区 · {{ todayText }}</span>
          <h1>{{ currentTitle }}</h1>
        </div>
        <div class="header-actions">
          <el-button class="header-add" type="primary" @click="openTaskComposer">
            <el-icon><Plus /></el-icon>
            <span>新建任务</span>
          </el-button>
          <el-button class="header-icon-button" text circle aria-label="切换主题" @click="userStore.toggleTheme()">
            <el-icon><Sunny v-if="userStore.theme === 'dark'" /><Moon v-else /></el-icon>
          </el-button>
          <el-avatar
            :size="34"
            class="user-avatar"
            :src="userStore.avatar || undefined"
            @click="router.push('/settings')"
          >{{ userInitial }}</el-avatar>
          <el-button class="header-icon-button" text circle aria-label="退出登录" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
          </el-button>
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

    <nav class="mobile-nav" aria-label="移动端导航">
      <router-link v-for="item in mobileNavItems" :key="item.path" :to="item.path" class="mobile-nav-item">
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.label }}</span>
      </router-link>
    </nav>
  </el-container>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useUserStore } from '@/store/userStore'
import { useTaskStore } from '@/store/taskStore'
import { useCalendarStore } from '@/store/calendarStore'

dayjs.locale('zh-cn')

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const taskStore = useTaskStore()
const calendarStore = useCalendarStore()

const navItems = [
  { path: '/dashboard', label: '总览', icon: 'House' },
  { path: '/tasks', label: '任务', icon: 'List' },
  { path: '/calendar', label: '日程', icon: 'Calendar' },
  { path: '/analytics', label: '复盘', icon: 'TrendCharts' },
  { path: '/ai-assistant', label: '助手', icon: 'ChatDotRound' },
  { path: '/settings', label: '设置', icon: 'Setting' },
] as const

const mobileNavItems = navItems.slice(0, 4)
const activeRoute = computed(() => route.path)
const currentTitle = computed(() => (route.meta.title as string) ?? '总览')
const userInitial = computed(() => userStore.name.trim().charAt(0).toUpperCase() || 'D')
const todayText = computed(() => dayjs().format('M月D日 dddd'))

watch(
  () => userStore.isLoggedIn,
  (loggedIn) => {
    if (loggedIn) {
      void taskStore.fetchTasks()
      void calendarStore.fetchEvents()
    }
  },
  { immediate: true },
)

function openTaskComposer() {
  router.push({ path: '/tasks', query: { new: '1' } })
}

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: var(--paper);
}

.app-sidebar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
}

.brand-lockup {
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 86px;
  padding: 0 24px;
  border-bottom: 1px solid var(--sidebar-border);
}

.brand-mark {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  background: var(--lime);
  color: var(--sidebar-brand-ink);
  font-size: 17px;
  font-weight: 850;
  border-radius: 7px;
}

.brand-lockup strong,
.brand-lockup span {
  display: block;
}

.brand-lockup strong {
  font-size: 14px;
  letter-spacing: 0.12em;
}

.brand-lockup span {
  margin-top: 3px;
  color: var(--sidebar-muted);
  font-size: 11px;
}

.sidebar-section-label {
  padding: 24px 26px 8px;
  color: var(--sidebar-faint);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.14em;
}

.sidebar-menu {
  flex: 1;
}

.sidebar-menu :deep(.el-menu-item .el-icon) {
  margin-right: 11px;
  color: var(--sidebar-icon);
  font-size: 16px;
}

.menu-count {
  min-width: 20px;
  margin-left: auto;
  padding: 2px 5px;
  background: rgba(216, 238, 119, 0.14);
  color: var(--lime);
  font-size: 10px;
  line-height: 1.2;
  text-align: center;
}

.sidebar-footer {
  padding: 16px 12px 18px;
  border-top: 1px solid var(--sidebar-border);
}

.sidebar-user,
.sidebar-theme {
  display: flex;
  align-items: center;
  width: 100%;
  border: 0;
  background: transparent;
  color: var(--sidebar-text);
  cursor: pointer;
  text-align: left;
}

.sidebar-user {
  gap: 10px;
  padding: 8px 10px;
  border-radius: 5px;
}

.sidebar-user:hover,
.sidebar-theme:hover {
  background: var(--sidebar-hover);
}

.sidebar-user-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.sidebar-user-copy strong {
  overflow: hidden;
  color: var(--sidebar-text);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-user-copy small {
  margin-top: 2px;
  color: var(--sidebar-muted);
  font-size: 10px;
}

.sidebar-theme {
  gap: 9px;
  margin-top: 4px;
  padding: 8px 12px;
  color: var(--sidebar-muted);
  font-size: 11px;
}

.app-main-container {
  min-width: 0;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 86px;
  padding: 0 34px;
  background: var(--paper);
  border-bottom: 1px solid var(--line);
}

.header-kicker {
  color: var(--ink-600);
  font-size: 11px;
}

.header-context h1 {
  margin-top: 5px;
  color: var(--ink-950);
  font-size: 20px;
  font-weight: 750;
  letter-spacing: -0.03em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-add {
  padding: 0 14px;
}

.header-icon-button {
  width: 34px;
  min-height: 34px;
  color: var(--ink-600) !important;
}

.user-avatar {
  background: var(--coral);
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 750;
}

.app-main {
  overflow-y: auto;
  min-height: calc(100vh - 86px);
  padding: 0;
  background: var(--paper);
}

.mobile-nav {
  display: none;
}

@media (max-width: 900px) {
  .app-sidebar {
    width: 210px !important;
  }

  .app-header {
    padding: 0 20px;
  }
}

@media (max-width: 640px) {
  .app-sidebar {
    display: none;
  }

  .app-header {
    min-height: 74px;
    padding: 0 16px;
  }

  .header-context h1 {
    font-size: 18px;
  }

  .header-kicker {
    font-size: 10px;
  }

  .header-add {
    width: 34px;
    padding: 0;
  }

  .header-add span {
    display: none;
  }

  .header-actions {
    gap: 4px;
  }

  .app-main {
    min-height: calc(100vh - 74px);
  }

  .mobile-nav {
    position: fixed;
    z-index: 20;
    right: 12px;
    bottom: 12px;
    left: 12px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: 6px;
    background: var(--ink-800);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    box-shadow: 0 10px 26px rgba(23, 34, 31, 0.22);
  }

  .mobile-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 7px 2px;
    color: #a8b5ac;
    font-size: 10px;
    text-decoration: none;
  }

  .mobile-nav-item.router-link-active {
    background: rgba(216, 238, 119, 0.13);
    color: var(--lime);
  }
}
</style>
