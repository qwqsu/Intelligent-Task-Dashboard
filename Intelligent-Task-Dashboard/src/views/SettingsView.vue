<template>
  <div class="page-container">
    <h2 class="mb-4">设置</h2>
    <el-row :gutter="16">
      <el-col :span="8">
        <el-card header="外观"><ThemeToggle /></el-card>
      </el-col>
      <el-col :span="8">
        <el-card header="布局"><LayoutSelector /></el-card>
      </el-col>
      <el-col :span="8">
        <el-card header="通知"><NotificationSettings /></el-card>
      </el-col>
    </el-row>

    <el-card header="个人信息" class="mt-4">
      <el-form :model="form" label-width="80px">
        <!-- 头像 -->
        <el-form-item label="头像">
          <div class="avatar-wrap">
            <el-avatar :size="64" :src="userStore.avatar || undefined">
              {{ userStore.name.charAt(0).toUpperCase() }}
            </el-avatar>
            <el-button size="small" @click="triggerAvatarUpload">更换头像</el-button>
            <input ref="avatarInput" type="file" accept="image/*" style="display:none" @change="onAvatarChange" />
          </div>
        </el-form-item>

        <!-- 用户名 -->
        <el-form-item label="用户名">
          <el-input v-model="form.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveName">保存</el-button>
          <el-button @click="showPwdDialog = true">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 修改密码弹窗 -->
    <el-dialog v-model="showPwdDialog" title="修改密码" width="400px" :close-on-click-modal="false">
      <el-form :model="pwdForm" :rules="pwdRules" ref="pwdRef" label-width="90px">
        <el-form-item label="当前密码" prop="old">
          <el-input v-model="pwdForm.old" type="password" show-password placeholder="请输入当前密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="pwdForm.newPwd" type="password" show-password placeholder="至少6位" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirm">
          <el-input v-model="pwdForm.confirm" type="password" show-password placeholder="再次输入新密码" @keyup.enter="submitPwd" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPwdDialog = false">取消</el-button>
        <el-button type="primary" @click="submitPwd">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/store/userStore'
import ThemeToggle from '@/components/Settings/ThemeToggle.vue'
import LayoutSelector from '@/components/Settings/LayoutSelector.vue'
import NotificationSettings from '@/components/Settings/NotificationSettings.vue'

const userStore = useUserStore()
const form = reactive({ name: userStore.name })

function saveName() {
  userStore.name = form.name
  ElMessage.success('保存成功')
}

// 头像
const avatarInput = ref<HTMLInputElement>()
function triggerAvatarUpload() {
  avatarInput.value?.click()
}
function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    userStore.setAvatar(ev.target?.result as string)
    ElMessage.success('头像已更新')
  }
  reader.readAsDataURL(file)
}

// 修改密码
const showPwdDialog = ref(false)
const pwdRef = ref<FormInstance>()
const pwdForm = reactive({ old: '', newPwd: '', confirm: '' })
const pwdRules: FormRules = {
  old: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 6, message: '至少6位', trigger: 'blur' }],
  confirm: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== pwdForm.newPwd) callback(new Error('两次密码不一致'))
        else callback()
      },
      trigger: 'blur',
    },
  ],
}

async function submitPwd() {
  await pwdRef.value?.validate()
  const ok = userStore.changePassword(pwdForm.old, pwdForm.newPwd)
  if (ok) {
    ElMessage.success('密码修改成功')
    showPwdDialog.value = false
    pwdForm.old = ''
    pwdForm.newPwd = ''
    pwdForm.confirm = ''
  } else {
    ElMessage.error('当前密码错误')
  }
}
</script>

<style scoped>
.mb-4 { margin-bottom: 16px; }
.mt-4 { margin-top: 16px; }
.avatar-wrap { display: flex; align-items: center; gap: 12px; }
</style>
