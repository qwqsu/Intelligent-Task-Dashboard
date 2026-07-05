import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark'

export interface UserRecord {
  username: string
  password: string
  avatar: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '用户',
    avatar: '',
    theme: 'light' as Theme,
    notificationsEnabled: true,
    compactLayout: false,
    isLoggedIn: false,
    users: [{ username: 'admin', password: '123456', avatar: '' }] as UserRecord[],
  }),
  getters: {
    currentUser(state): UserRecord | undefined {
      return state.users.find((u) => u.username === state.name)
    },
  },
  actions: {
    setTheme(theme: Theme) {
      this.theme = theme
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    toggleTheme() {
      this.setTheme(this.theme === 'light' ? 'dark' : 'light')
    },
    applyTheme() {
      this.setTheme(this.theme)
    },
    setNotifications(val: boolean) {
      this.notificationsEnabled = val
    },
    setCompactLayout(val: boolean) {
      this.compactLayout = val
    },
    login(username: string, password: string): boolean {
      const user = this.users.find((u) => u.username === username && u.password === password)
      if (user) {
        this.name = user.username
        this.avatar = user.avatar
        this.isLoggedIn = true
        return true
      }
      return false
    },
    register(username: string, password: string): boolean {
      if (this.users.find((u) => u.username === username)) return false
      this.users.push({ username, password, avatar: '' })
      return true
    },
    changePassword(oldPassword: string, newPassword: string): boolean {
      const user = this.users.find((u) => u.username === this.name)
      if (!user || user.password !== oldPassword) return false
      user.password = newPassword
      return true
    },
    setAvatar(avatar: string) {
      this.avatar = avatar
      const user = this.users.find((u) => u.username === this.name)
      if (user) user.avatar = avatar
    },
    logout() {
      this.isLoggedIn = false
    },
  },
  persist: true,
})
