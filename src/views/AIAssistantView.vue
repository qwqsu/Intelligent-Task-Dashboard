<template>
  <div class="page-container ai-view">
    <el-row :gutter="16" class="ai-layout">
      <el-col :span="16" class="chat-col">
        <el-card class="chat-card">
          <template #header>
            <div class="chat-header">
              <el-icon><ChatDotRound /></el-icon>
              <span>AI 助手</span>
              <el-button size="small" text @click="aiStore.clearMessages()">清空对话</el-button>
            </div>
          </template>
          <AISuggestions class="chat-messages" />
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
import { useAIStore } from '@/store/aiStore'
import { useTaskStore } from '@/store/taskStore'
import { useCalendarStore } from '@/store/calendarStore'
import { sendAIMessage } from '@/api/aiApi'
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
    const reply = await sendAIMessage(history, context)
    aiStore.addMessage('assistant', reply)
  } catch {
    aiStore.addMessage('assistant', '抱歉，AI 服务暂时不可用，请稍后再试。')
  } finally {
    aiStore.setLoading(false)
  }
}
</script>

<style scoped>
.ai-view { height: calc(100vh - 120px); }
.ai-layout { height: 100%; }
.chat-col { height: 100%; }
.chat-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.chat-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.chat-header span { flex: 1; font-weight: 600; }
.chat-messages { flex: 1; overflow-y: auto; }
</style>
