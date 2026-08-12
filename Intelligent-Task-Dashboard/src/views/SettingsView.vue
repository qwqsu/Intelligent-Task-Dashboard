<template>
  <div class="page-container settings-page">
    <div class="page-heading">
      <div>
        <p class="eyebrow">让工具适合你</p>
        <h1>设置</h1>
        <p>调整界面和个人信息，让每天打开它都顺手。</p>
      </div>
    </div>

    <div class="settings-grid">
      <el-card>
        <template #header><span>外观</span></template>
        <ThemeToggle />
      </el-card>
      <el-card>
        <template #header><span>布局</span></template>
        <LayoutSelector />
      </el-card>
      <el-card>
        <template #header><span>通知</span></template>
        <NotificationSettings />
      </el-card>
    </div>

    <el-card class="profile-card">
      <template #header>
        <div class="profile-heading">
          <span>个人信息</span>
          <small>仅保存在当前设备</small>
        </div>
      </template>
      <el-form :model="form" label-position="top" class="profile-form">
        <el-form-item label="头像">
          <div class="avatar-wrap">
            <el-avatar :size="64" :src="userStore.avatar || undefined">
              {{ userStore.name.charAt(0).toUpperCase() }}
            </el-avatar>
            <div>
              <el-button size="small" @click="triggerAvatarUpload">更换头像</el-button>
              <p class="form-hint">支持 JPG、PNG，建议小于 2MB</p>
            </div>
            <input ref="avatarInput" type="file" accept="image/png,image/jpeg" hidden @change="onAvatarChange" />
          </div>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.name" maxlength="20" show-word-limit placeholder="输入一个称呼" />
        </el-form-item>
        <div class="profile-actions">
          <el-button type="primary" @click="saveName">保存资料</el-button>
          <el-button @click="showPwdDialog = true">修改密码</el-button>
        </div>
      </el-form>
    </el-card>

    <el-dialog v-model="showPwdDialog" title="修改密码" width="420px" :close-on-click-modal="false">
      <el-form :model="pwdForm" :rules="pwdRules" ref="pwdRef" label-position="top">
        <el-form-item label="当前密码" prop="old">
          <el-input v-model="pwdForm.old" type="password" show-password placeholder="输入当前密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="pwdForm.newPwd" type="password" show-password placeholder="至少 6 位" />
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
  const name = form.name.trim()
  if (!name) {
    ElMessage.warning('用户名不能为空')
    return
  }
  userStore.name = name
  ElMessage.success('资料已保存')
}

const avatarInput = ref<HTMLInputElement>()
function triggerAvatarUpload() {
  avatarInput.value?.click()
}

function onAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > 2 * 1024 * 1024) {
    ElMessage.warning('请上传 2MB 以内的 JPG 或 PNG 图片')
    input.value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    userStore.setAvatar(String(reader.result ?? ''))
    ElMessage.success('头像已更新')
    input.value = ''
  }
  reader.readAsDataURL(file)
}

const showPwdDialog = ref(false)
const pwdRef = ref<FormInstance>()
const pwdForm = reactive({ old: '', newPwd: '', confirm: '' })
const pwdRules: FormRules = {
  old: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 6, message: '至少 6 位', trigger: 'blur' }],
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
  let valid = false
  try {
    valid = await pwdRef.value?.validate() ?? false
  } catch {
    return
  }
  if (!valid) return
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
.settings-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.profile-card { margin-top: 18px; }
.profile-heading { display: flex; align-items: center; justify-content: space-between; }
.profile-heading small { color: var(--ink-400); font-size: 10px; font-weight: 400; }
.profile-form { max-width: 620px; }
.avatar-wrap { display: flex; align-items: center; gap: 14px; }
.form-hint { margin-top: 7px; color: var(--ink-400); font-size: 11px; }
.profile-actions { display: flex; gap: 8px; margin-top: 4px; }

@media (max-width: 720px) {
  .settings-grid { grid-template-columns: 1fr; }
}
</style>
