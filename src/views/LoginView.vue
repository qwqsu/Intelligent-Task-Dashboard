<template>
  <div class="login-page">
    <!-- 漂浮装饰气泡 -->
    <div class="bubble bubble-1"></div>
    <div class="bubble bubble-2"></div>
    <div class="bubble bubble-3"></div>
    <div class="bubble bubble-4"></div>
    <div class="bubble bubble-5"></div>

    <div class="login-card">
      <div class="login-logo">
        <el-icon size="40" color="#27B8E7"><DataAnalysis /></el-icon>
        <h1>智能任务仪表盘</h1>
        <p>管理你的任务、日程与数据</p>
      </div>

      <!-- 登录表单 -->
      <el-form v-if="mode === 'login'" :model="loginForm" :rules="loginRules" ref="loginRef" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名" size="large" prefix-icon="User" @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码" size="large" prefix-icon="Lock" show-password @keyup.enter="handleLogin" />
        </el-form-item>
        <el-button type="primary" size="large" class="submit-btn" :loading="loading" @click="handleLogin">登录</el-button>
        <p class="switch-tip">没有账号？<el-link type="primary" @click="switchMode('register')">立即注册</el-link></p>
      </el-form>

      <!-- 注册表单 -->
      <el-form v-else :model="regForm" :rules="regRules" ref="regRef" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="regForm.username" placeholder="用户名" size="large" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="regForm.password" type="password" placeholder="密码" size="large" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item prop="confirm">
          <el-input v-model="regForm.confirm" type="password" placeholder="确认密码" size="large" prefix-icon="Lock" show-password @keyup.enter="handleRegister" />
        </el-form-item>
        <el-button type="primary" size="large" class="submit-btn" :loading="loading" @click="handleRegister">注册</el-button>
        <p class="switch-tip">已有账号？<el-link type="primary" @click="switchMode('login')">返回登录</el-link></p>
      </el-form>

      <p v-if="mode === 'login'" class="login-hint">演示账号：admin / 123456</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/store/userStore'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const mode = ref<'login' | 'register'>('login')

const loginRef = ref<FormInstance>()
const loginForm = reactive({ username: '', password: '' })
const loginRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const regRef = ref<FormInstance>()
const regForm = reactive({ username: '', password: '', confirm: '' })
const regRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码至少6位', trigger: 'blur' }],
  confirm: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== regForm.password) callback(new Error('两次密码不一致'))
        else callback()
      },
      trigger: 'blur',
    },
  ],
}

function switchMode(m: 'login' | 'register') {
  mode.value = m
}

async function handleLogin() {
  await loginRef.value?.validate()
  loading.value = true
  await new Promise((r) => setTimeout(r, 400))
  const ok = userStore.login(loginForm.username, loginForm.password)
  loading.value = false
  if (ok) {
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } else {
    ElMessage.error('用户名或密码错误')
  }
}

async function handleRegister() {
  await regRef.value?.validate()
  loading.value = true
  await new Promise((r) => setTimeout(r, 400))
  const ok = userStore.register(regForm.username, regForm.password)
  loading.value = false
  if (ok) {
    ElMessage.success('注册成功，请登录')
    loginForm.username = regForm.username
    loginForm.password = ''
    switchMode('login')
  } else {
    ElMessage.error('用户名已存在')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse 80% 60% at 10% 20%, #8EE4E8 0%, transparent 55%),
    radial-gradient(ellipse 60% 50% at 90% 10%, #FFF7A4 0%, transparent 50%),
    radial-gradient(ellipse 70% 60% at 80% 90%, #27B8E7 0%, transparent 55%),
    radial-gradient(ellipse 50% 40% at 20% 85%, #FFF7A4 0%, transparent 45%),
    #FDFCF3;
}

/* 漂浮气泡 */
.bubble {
  position: absolute;
  border-radius: 50%;
  opacity: 0.45;
  animation: float linear infinite;
}
.bubble-1 {
  width: 120px; height: 120px;
  background: radial-gradient(circle at 35% 35%, #FFF7A4, #8EE4E8);
  left: 8%; top: 15%;
  animation-duration: 9s;
  animation-delay: 0s;
}
.bubble-2 {
  width: 80px; height: 80px;
  background: radial-gradient(circle at 35% 35%, #8EE4E8, #27B8E7);
  right: 12%; top: 20%;
  animation-duration: 12s;
  animation-delay: -3s;
}
.bubble-3 {
  width: 160px; height: 160px;
  background: radial-gradient(circle at 35% 35%, #FDFCF3, #FFF7A4);
  right: 6%; bottom: 18%;
  animation-duration: 15s;
  animation-delay: -6s;
}
.bubble-4 {
  width: 60px; height: 60px;
  background: radial-gradient(circle at 35% 35%, #27B8E7, #8EE4E8);
  left: 18%; bottom: 25%;
  animation-duration: 10s;
  animation-delay: -2s;
}
.bubble-5 {
  width: 100px; height: 100px;
  background: radial-gradient(circle at 35% 35%, #FFF7A4, #FDFCF3);
  left: 50%; top: 8%;
  animation-duration: 13s;
  animation-delay: -5s;
}

@keyframes float {
  0%   { transform: translateY(0px) rotate(0deg); }
  33%  { transform: translateY(-18px) rotate(4deg); }
  66%  { transform: translateY(10px) rotate(-3deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

.login-card {
  position: relative;
  z-index: 1;
  background: rgba(253, 252, 243, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  padding: 48px 40px;
  width: 400px;
  box-shadow: 0 20px 60px rgba(39, 184, 231, 0.15), 0 4px 16px rgba(0, 0, 0, 0.06);
}
.login-logo { text-align: center; margin-bottom: 32px; }
.login-logo h1 { font-size: 22px; font-weight: 700; margin: 12px 0 6px; color: #1a4a5e; }
.login-logo p { font-size: 14px; color: #4a7a8a; }
.login-form { display: flex; flex-direction: column; gap: 4px; }
.login-form :deep(.el-form-item) { margin-bottom: 16px; }
.login-form :deep(.el-input__wrapper) {
  border-radius: 12px !important;
  padding: 4px 12px;
  box-shadow: 0 0 0 1px rgba(39, 184, 231, 0.25) !important;
  background: rgba(255, 255, 255, 0.75) !important;
  transition: box-shadow 0.2s ease !important;
}
.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1.5px rgba(39, 184, 231, 0.5) !important;
}
.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(39, 184, 231, 0.7) !important;
}
/* 自动填充时保持与普通状态一致，不改变背景色 */
.login-form :deep(.el-input__inner:-webkit-autofill),
.login-form :deep(.el-input__inner:-webkit-autofill:hover),
.login-form :deep(.el-input__inner:-webkit-autofill:focus) {
  -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.75) inset !important;
  -webkit-text-fill-color: #1a4a5e !important;
  transition: background-color 99999s ease !important;
}
.submit-btn { width: 100%; margin-top: 8px; }
.switch-tip { text-align: center; margin-top: 12px; font-size: 13px; color: #4a7a8a; }
.login-hint { text-align: center; margin-top: 16px; font-size: 13px; color: #7aabb8; }
</style>
