<template>
  <div class="login-page">
    <aside class="login-aside">
      <span class="login-overline">DAYFLOW / PERSONAL PLANNING</span>
      <div class="aside-copy">
        <h1>把生活，<br /><em>排成你喜欢的样子。</em></h1>
        <p>一个不催促你、只帮你看清下一步的个人规划台。</p>
      </div>
      <div class="aside-notes">
        <div><strong>01</strong><span>先收集，再安排</span></div>
        <div><strong>02</strong><span>给重要的事留空间</span></div>
        <div><strong>03</strong><span>每周看一眼自己的节奏</span></div>
      </div>
      <span class="aside-footer">PLAN SMALL · LIVE WELL</span>
    </aside>

    <main class="login-stage">
      <div class="login-card">
        <div class="login-logo">
          <div class="brand-mark">D</div>
          <div>
            <h2>DAYFLOW</h2>
            <p>你的个人规划台</p>
          </div>
        </div>

        <div class="form-heading">
          <span class="eyebrow">{{ mode === 'login' ? '欢迎回来' : '创建空间' }}</span>
          <h1>{{ mode === 'login' ? '继续今天的计划' : '从一个称呼开始' }}</h1>
        </div>

        <el-form v-if="mode === 'login'" :model="loginForm" :rules="loginRules" ref="loginRef" class="login-form">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username" placeholder="例如：小林" size="large" @keyup.enter="handleLogin" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="输入密码" size="large" show-password @keyup.enter="handleLogin" />
          </el-form-item>
          <el-button type="primary" size="large" class="submit-btn" :loading="loading" @click="handleLogin">登录工作区</el-button>
          <p class="switch-tip">还没有空间？<el-link type="primary" @click="switchMode('register')">创建一个</el-link></p>
        </el-form>

        <el-form v-else :model="regForm" :rules="regRules" ref="regRef" class="login-form">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="regForm.username" placeholder="例如：小林" size="large" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="regForm.password" type="password" placeholder="至少 6 位" size="large" show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirm">
            <el-input v-model="regForm.confirm" type="password" placeholder="再次输入密码" size="large" show-password @keyup.enter="handleRegister" />
          </el-form-item>
          <el-button type="primary" size="large" class="submit-btn" :loading="loading" @click="handleRegister">创建工作区</el-button>
          <p class="switch-tip">已经有空间？<el-link type="primary" @click="switchMode('login')">返回登录</el-link></p>
        </el-form>

        <p v-if="mode === 'login'" class="login-hint">演示账号：admin / 123456</p>
      </div>
    </main>
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
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码至少 6 位', trigger: 'blur' }],
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

function switchMode(nextMode: 'login' | 'register') {
  mode.value = nextMode
}

async function handleLogin() {
  let valid = false
  try {
    valid = await loginRef.value?.validate() ?? false
  } catch {
    return
  }
  if (!valid) return
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 350))
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
  let valid = false
  try {
    valid = await regRef.value?.validate() ?? false
  } catch {
    return
  }
  if (!valid) return
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 350))
  const ok = userStore.register(regForm.username, regForm.password)
  loading.value = false
  if (ok) {
    ElMessage.success('注册成功，请登录')
    loginForm.username = regForm.username.trim()
    loginForm.password = ''
    switchMode('login')
  } else {
    ElMessage.error('用户名已存在')
  }
}
</script>

<style scoped>
.login-page { display: grid; grid-template-columns: minmax(320px, 42%) 1fr; min-height: 100vh; background: var(--paper); }
.login-aside { display: flex; flex-direction: column; justify-content: space-between; min-height: 100vh; padding: 48px clamp(32px, 6vw, 90px); background: var(--ink-800); color: #f5f7ee; }
.login-overline, .aside-footer { color: #91a298; font-size: 10px; letter-spacing: 0.14em; }
.aside-copy { margin: auto 0; max-width: 410px; }
.aside-copy h1 { font-size: clamp(38px, 4.7vw, 67px); font-weight: 720; letter-spacing: -0.065em; line-height: 1.02; }
.aside-copy h1 em { color: var(--lime); font-style: normal; }
.aside-copy p { max-width: 270px; margin-top: 24px; color: #aebbb2; font-size: 14px; line-height: 1.75; }
.aside-notes { display: grid; gap: 13px; max-width: 280px; }
.aside-notes div { display: flex; align-items: center; gap: 12px; padding-top: 11px; border-top: 1px solid rgba(255,255,255,0.12); }
.aside-notes strong { color: var(--lime); font-size: 11px; }
.aside-notes span { color: #c7d1ca; font-size: 12px; }
.login-stage { display: grid; place-items: center; padding: 32px; }
.login-card { width: min(100%, 430px); padding: 12px 10px; }
.login-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 62px; }
.brand-mark { display: grid; width: 34px; height: 34px; place-items: center; background: var(--moss); border-radius: 7px; color: #fff; font-size: 17px; font-weight: 850; }
.login-logo h2 { color: var(--ink-950); font-size: 14px; letter-spacing: 0.12em; }
.login-logo p { margin-top: 3px; color: var(--ink-600); font-size: 11px; }
.form-heading { margin-bottom: 26px; }
.form-heading h1 { color: var(--ink-950); font-size: 28px; font-weight: 780; letter-spacing: -0.05em; }
.login-form :deep(.el-form-item) { margin-bottom: 18px; }
.login-form :deep(.el-form-item__label) { color: var(--ink-600); font-size: 12px; line-height: 1.2; }
.login-form :deep(.el-input__wrapper) { min-height: 44px; }
.submit-btn { width: 100%; height: 44px; margin-top: 5px; }
.switch-tip, .login-hint { color: var(--ink-600); font-size: 12px; text-align: center; }
.switch-tip { margin-top: 19px; }
.login-hint { margin-top: 45px; color: var(--ink-400); }

@media (max-width: 760px) {
  .login-page { display: block; }
  .login-aside { display: none; }
  .login-stage { min-height: 100vh; padding: 28px 22px; }
  .login-logo { margin-bottom: 50px; }
}
</style>
