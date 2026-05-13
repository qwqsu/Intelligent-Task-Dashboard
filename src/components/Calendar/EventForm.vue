<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="68px">
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" placeholder="请输入事件标题" />
    </el-form-item>
    <el-form-item label="描述">
      <el-input v-model="form.description" type="textarea" :rows="2" />
    </el-form-item>
    <el-form-item label="开始" prop="start">
      <el-date-picker v-model="form.start" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss" style="width: 100%" />
    </el-form-item>
    <el-form-item label="结束" prop="end">
      <el-date-picker v-model="form.end" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss" style="width: 100%" />
    </el-form-item>
    <el-form-item label="颜色">
      <el-color-picker v-model="form.color" />
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
import type { CalendarEvent } from '@/store/calendarStore'
import dayjs from 'dayjs'

const props = defineProps<{ initial?: CalendarEvent | null; defaultDate?: string }>()
const emit = defineEmits<{
  submit: [event: Omit<CalendarEvent, 'id'> | CalendarEvent]
  cancel: []
}>()

const formRef = ref<FormInstance>()
const form = reactive({
  title: '',
  description: '',
  start: '',
  end: '',
  color: '#409eff',
})

watch(() => props.initial, (val) => {
  if (val) {
    form.title = val.title
    form.description = val.description ?? ''
    form.start = val.start
    form.end = val.end
    form.color = val.color ?? '#409eff'
  } else if (props.defaultDate) {
    form.start = `${props.defaultDate}T09:00:00`
    form.end = `${props.defaultDate}T10:00:00`
  }
}, { immediate: true })

const rules: FormRules = {
  title: [{ required: true, message: '请输入事件标题', trigger: 'blur' }],
  start: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  end: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
}

async function handleSubmit() {
  await formRef.value?.validate()
  if (props.initial) {
    emit('submit', { ...props.initial, ...form })
  } else {
    emit('submit', { ...form })
  }
}
</script>
