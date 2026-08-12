<template>
  <div class="chat-messages" ref="messagesEl">
    <div v-if="!aiStore.messages.length" class="empty-chat">
      <div class="empty-mark">D</div>
      <p>从一个具体的困扰开始</p>
      <div class="quick-prompts">
        <el-button
          v-for="prompt in quickPrompts"
          :key="prompt"
          size="small"
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
        <div class="message-avatar">{{ msg.role === 'assistant' ? 'D' : '我' }}</div>
      <div class="message-content">
        <p class="message-text">{{ msg.content }}</p>
        <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
      </div>
    </div>
    <div v-if="aiStore.loading" class="message assistant">
        <div class="message-avatar">D</div>
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
  '帮我整理今天的任务顺序',
  '给我一个可执行的时间安排',
  '总结我的待办并找出下一步',
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
.chat-messages { min-height: 300px; max-height: 560px; overflow-y: auto; padding: 8px 0; }
.empty-chat { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 70px 0; color: var(--el-text-color-secondary); }
.empty-mark { display: grid; width: 42px; height: 42px; place-items: center; background: var(--moss); color: #fff; font-size: 17px; font-weight: 800; }
.quick-prompts { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.message { display: flex; gap: 10px; margin-bottom: 16px; }
.message.user { flex-direction: row-reverse; }
.message-content { max-width: 70%; }
.message.user .message-content { align-items: flex-end; display: flex; flex-direction: column; }
.message-avatar { display: grid; width: 26px; height: 26px; flex-shrink: 0; place-items: center; background: var(--moss-soft); color: var(--moss); font-size: 11px; font-weight: 800; }
.message.user .message-avatar { background: var(--coral-soft); color: var(--coral); }
.message-text {
  background: var(--el-fill-color-light);
  padding: 10px 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 5px;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}
.message.user .message-text { background: var(--el-color-primary-light-8); }
.message-time { font-size: 11px; color: var(--el-text-color-placeholder); margin-top: 4px; }
</style>
