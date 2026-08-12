import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/userStore'

const routes = [
  {
    path: '/login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录', public: true },
  },
  { path: '/', redirect: '/dashboard' },
  {
    path: '/dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: '总览' },
  },
  {
    path: '/tasks',
    component: () => import('@/views/TaskView.vue'),
    meta: { title: '任务' },
  },
  {
    path: '/calendar',
    component: () => import('@/views/CalendarView.vue'),
    meta: { title: '日程' },
  },
  {
    path: '/ai-assistant',
    component: () => import('@/views/AIAssistantView.vue'),
    meta: { title: '助手' },
  },
  {
    path: '/analytics',
    component: () => import('@/views/AnalyticsView.vue'),
    meta: { title: '复盘' },
  },
  {
    path: '/settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { title: '设置' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!to.meta.public && !userStore.isLoggedIn) return '/login'
})

router.afterEach((to) => {
  document.title = `${to.meta.title ?? '工作区'} · Dayflow`
})

export default router
