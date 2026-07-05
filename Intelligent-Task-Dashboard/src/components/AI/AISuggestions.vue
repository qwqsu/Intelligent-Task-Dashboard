<template>
  <div class="chat-messages" ref="messagesEl">
    <div v-if="!aiStore.messages.length" class="empty-chat">
      <el-icon size="48" color="#c0c4cc"><ChatDotRound /></el-icon>
      <p>开始与 AI 助手对话吧</p>
      <div class="quick-prompts">
        <el-button
          v-for="prompt in quickPrompts"
          :key="prompt"
          size="small"
          round
          @click="emit('send', prompt)"
        >{{ prompt }}</el-button>
      </div>
    </div>
    <div
      v-for="msg in aiStore.messages"
      :key="msg.id"
      class="message"
      :class="msg.role"
    >
      <div class="message-avatar">
        <el-avatar size="small" :style="{ background: msg.role === 'assistant' ? '#409eff' : '#67c23a' }">
          {{ msg.role === 'assistant' ? 'AI' : '我' }}
        </el-avatar>
      </div>
      <div class="message-content">
        <p class="message-text">{{ msg.content }}</p>
        <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
      </div>
    </div>
    <div v-if="aiStore.loading" class="message assistant">
      <div class="message-avatar">
        <el-avatar size="small" style="background: #409eff">AI</el-avatar>
      </div>
      <div class="message-content">
        <el-skeleton :rows="2" animated />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue'
import dayjs from 'dayjs'
import { useAIStore } from '@/store/aiStore'

const emit = defineEmits<{ send: [text: string] }>()
const aiStore = useAIStore()
const messagesEl = ref<HTMLElement>()

const quickPrompts = [
  '帮我分析今天的任务优先级',
  '给我一些时间管理建议',
  '总结我的待办事项',
]

watch(() => aiStore.messages.length, async () => {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
})

function formatTime(iso: string) {
  return dayjs(iso).format('HH:mm')
}
</script>

<style scoped>
.chat-messages { min-height: 300px; max-height: 500px; overflow-y: auto; padding: 8px 0; }
.empty-chat { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px 0; color: var(--el-text-color-secondary); }
.quick-prompts { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.message { display: flex; gap: 10px; margin-bottom: 16px; }
.message.user { flex-direction: row-reverse; }
.message-content { max-width: 70%; }
.message.user .message-content { align-items: flex-end; display: flex; flex-direction: column; }
.message-text {
  background: var(--el-fill-color-light);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}
.message.user .message-text { background: var(--el-color-primary-light-8); }
.message-time { font-size: 11px; color: var(--el-text-color-placeholder); margin-top: 4px; }
</style>
