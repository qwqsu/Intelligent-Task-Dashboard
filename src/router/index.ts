import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/userStore'
import DashboardView from '@/views/DashboardView.vue'
import TaskView from '@/views/TaskView.vue'
import CalendarView from '@/views/CalendarView.vue'
import AIAssistantView from '@/views/AIAssistantView.vue'
import AnalyticsView from '@/views/AnalyticsView.vue'
import SettingsView from '@/views/SettingsView.vue'
import LoginView from '@/views/LoginView.vue'

const routes = [
  { path: '/login', component: LoginView, meta: { title: '登录', public: true } },
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: DashboardView, meta: { title: '仪表盘' } },
  { path: '/tasks', component: TaskView, meta: { title: '任务管理' } },
  { path: '/calendar', component: CalendarView, meta: { title: '日程管理' } },
  { path: '/ai-assistant', component: AIAssistantView, meta: { title: 'AI 助手' } },
  { path: '/analytics', component: AnalyticsView, meta: { title: '数据分析' } },
  { path: '/settings', component: SettingsView, meta: { title: '设置' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫：未登录时跳转到登录页
// useUserStore 在 beforeEach 里调用（pinia 已初始化后），不会有循环依赖问题
router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!to.meta.public && !userStore.isLoggedIn) {
    return '/login'
  }
})

router.afterEach((to) => {
  document.title = `${to.meta.title ?? '智能仪表盘'} - 智能任务仪表盘`
})

export default router
