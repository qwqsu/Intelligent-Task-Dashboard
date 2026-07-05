<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" placeholder="请输入任务标题" @keyup.enter.prevent="handleSubmit" />
    </el-form-item>
    <el-form-item label="描述">
      <el-input v-model="form.description" type="textarea" :rows="3" placeholder="可选描述" />
    </el-form-item>
    <el-form-item label="优先级" prop="priority">
      <el-select v-model="form.priority" style="width: 100%">
        <el-option label="高" value="high" />
        <el-option label="中" value="medium" />
        <el-option label="低" value="low" />
      </el-select>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model="form.status" style="width: 100%">
        <el-option label="待办" value="todo" />
        <el-option label="进行中" value="in-progress" />
        <el-option label="已完成" value="done" />
      </el-select>
    </el-form-item>
    <el-form-item label="截止时间">
      <el-date-picker
        v-model="form.dueDate"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm"
        format="YYYY-MM-DD HH:mm"
        placeholder="可选，选择截止日期和时间"
        style="width: 100%"
        clearable
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">{{ initial ? '保存' : '创建' }}</el-button>
      <el-button @click="emit('cancel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Task } from '@/store/taskStore'

const props = defineProps<{ initial?: Task | null }>()
const emit = defineEmits<{ submit: [task: Omit<Task, 'id' | 'createdAt'>]; cancel: [] }>()

const formRef = ref<FormInstance>()

const form = reactive({
  title: '',
  description: '',
  priority: 'medium' as Task['priority'],
  status: 'todo' as Task['status'],
  dueDate: '',
})

watch(() => props.initial, (val) => {
  if (val) {
    form.title = val.title
    form.description = val.description ?? ''
    form.priority = val.priority
    form.status = val.status
    form.dueDate = val.dueDate ?? ''
  }
}, { immediate: true })

const rules: FormRules = {
  title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }],
  priority: [{ required: true }],
  status: [{ required: true }],
}

async function handleSubmit() {
  await formRef.value?.validate()
  emit('submit', { ...form })
}
</script>
