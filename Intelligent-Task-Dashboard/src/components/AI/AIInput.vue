<template>
  <div class="ai-input">
    <el-input
      v-model="inputText"
      type="textarea"
      :rows="3"
      placeholder="输入你的问题或请求..."
      :disabled="loading"
      @keydown.ctrl.enter="handleSend"
    />
    <div class="input-footer">
      <span class="hint">Ctrl+Enter 发送</span>
      <el-button type="primary" :loading="loading" @click="handleSend" :disabled="!inputText.trim()">
        发送
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{ loading?: boolean }>()
const emit = defineEmits<{ send: [text: string] }>()

const inputText = ref('')

function handleSend() {
  const text = inputText.value.trim()
  if (!text || props.loading) return
  emit('send', text)
  inputText.value = ''
}
</script>

<style scoped>
.ai-input { padding: 12px 0 0; }
.input-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
.hint { font-size: 12px; color: var(--el-text-color-placeholder); }
</style>
