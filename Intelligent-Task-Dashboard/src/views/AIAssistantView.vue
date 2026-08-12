<template>
  <div class="page-container ai-view">
    <div class="ai-intro">
      <div>
        <p class="eyebrow">辅助思考</p>
        <h1>助手</h1>
        <p>把一句模糊的想法，整理成可以开始的下一步。</p>
      </div>
      <span class="ai-status"><i /> 已连接</span>
    </div>
    <el-row :gutter="16" class="ai-layout">
      <el-col :span="16" class="chat-col">
        <el-card class="chat-card">
          <template #header>
            <div class="chat-header">
              <div class="chat-title">
                <span class="chat-mark">D</span>
                <span>工作台对话</span>
              </div>
              <el-button size="small" text @click="aiStore.clearMessages()">清空</el-button>
            </div>
          </template>
          <AISuggestions class="chat-messages" @send="handleSend" />
          <AIInput @send="handleSend" :loading="aiStore.loading" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <AINotifications />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus'
import dayjs from 'dayjs'
import { useAIStore } from '@/store/aiStore'
import { useTaskStore } from '@/store/taskStore'
import { useCalendarStore } from '@/store/calendarStore'
import { sendAIMessage } from '@/api/aiApi'
import type { Task } from '@/store/taskStore'
import type { CalendarEvent } from '@/store/calendarStore'
import AIInput from '@/components/AI/AIInput.vue'
import AISuggestions from '@/components/AI/AISuggestions.vue'
import AINotifications from '@/components/AI/AINotifications.vue'

const aiStore = useAIStore()
const taskStore = useTaskStore()
const calendarStore = useCalendarStore()

async function handleSend(text: string) {
  aiStore.addMessage('user', text)
  aiStore.setLoading(true)
  try {
    const history = aiStore.messages.map((m) => ({ role: m.role, content: m.content }))
    const context = { tasks: taskStore.tasks, events: calendarStore.events }
    const { reply, action } = await sendAIMessage(history, context)
    aiStore.addMessage('assistant', reply)

    if (action) {
      await executeAction(action.action, action.payload)
    }
  } catch {
    aiStore.addMessage('assistant', '抱歉，AI 服务暂时不可用，请稍后再试。')
  } finally {
    aiStore.setLoading(false)
  }
}

async function executeAction(type: string, payload: Record<string, unknown>) {
  if (type === 'create_task') {
    const title = String(payload.title ?? '').trim()
    if (!title) return
    const task = {
      title,
      description: payload.description ? String(payload.description) : undefined,
      status: (payload.status as Task['status']) ?? 'todo',
      priority: (payload.priority as Task['priority']) ?? 'medium',
      dueDate: payload.dueDate ? String(payload.dueDate) : undefined,
    }
    await taskStore.addTask(task)
    ElNotification({ title: 'AI 已创建任务', message: task.title, type: 'success', duration: 3000 })
  } else if (type === 'create_event') {
    const title = String(payload.title ?? '').trim()
    const start = String(payload.start ?? '')
    const end = String(payload.end ?? '')
    if (!title || !start || !end || !dayjs(end).isAfter(dayjs(start))) return
    await calendarStore.addEvent({
      title,
      start,
      end,
      description: payload.description ? String(payload.description) : undefined,
    } as Omit<CalendarEvent, 'id'>)
    ElNotification({ title: '助手已创建日程', message: title, type: 'success', duration: 3000 })
  }
}
</script>

<style scoped>
.ai-view { min-height: calc(100vh - 86px); }
.ai-intro { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 20px; }
.ai-intro h1 { color: var(--ink-950); font-size: 28px; font-weight: 780; letter-spacing: -0.05em; }
.ai-intro p:last-child { margin-top: 8px; color: var(--ink-600); font-size: 12px; }
.ai-status { display: inline-flex; align-items: center; gap: 6px; color: var(--el-color-success); font-size: 11px; }
.ai-status i { width: 6px; height: 6px; background: var(--el-color-success); border-radius: 50%; }
.ai-layout { min-height: 610px; }
.chat-col { height: 100%; }
.chat-card {
  min-height: 610px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.chat-header { display: flex; align-items: center; justify-content: space-between; }
.chat-title { display: flex; align-items: center; gap: 9px; font-weight: 700; }
.chat-mark { display: grid; width: 24px; height: 24px; place-items: center; background: var(--moss-soft); color: var(--moss); font-size: 11px; font-weight: 800; }
.chat-messages { flex: 1; overflow-y: auto; }

@media (max-width: 760px) {
  .ai-intro { align-items: flex-start; flex-direction: column; gap: 12px; }
  .chat-col { margin-bottom: 16px; }
  .ai-layout, .chat-card { min-height: 520px; }
}
</style>
