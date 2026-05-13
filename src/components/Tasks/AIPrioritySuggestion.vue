<template>
  <el-alert type="info" :closable="false" show-icon>
    <template #title>
      <span>AI 优先级建议</span>
      <el-button size="small" text :loading="loading" @click="getSuggestions" style="margin-left: 8px">
        {{ loading ? '分析中...' : '获取建议' }}
      </el-button>
    </template>
    <div v-if="suggestions.length" class="suggestions">
      <div v-for="(s, i) in suggestions" :key="i" class="suggestion-item">
        <el-icon><InfoFilled /></el-icon>
        {{ s }}
      </div>
    </div>
    <p v-else class="hint">点击"获取建议"让 AI 分析你的任务优先级</p>
  </el-alert>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useTaskStore } from '@/store/taskStore'
import { getAISuggestions } from '@/api/aiApi'

const taskStore = useTaskStore()
const loading = ref(false)
const suggestions = ref<string[]>([])

async function getSuggestions() {
  if (!taskStore.tasks.length) {
    ElMessage.info('暂无任务可分析')
    return
  }
  loading.value = true
  try {
    const input = taskStore.tasks.map((t) => `${t.title}(${t.priority})`).join(', ')
    suggestions.value = await getAISuggestions(input)
  } catch {
    ElMessage.error('AI 服务暂不可用')
    suggestions.value = ['请配置 AI API 后使用此功能']
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.suggestions { margin-top: 8px; }
.suggestion-item { display: flex; align-items: center; gap: 6px; padding: 2px 0; font-size: 13px; }
.hint { font-size: 13px; color: var(--el-text-color-secondary); }
</style>
