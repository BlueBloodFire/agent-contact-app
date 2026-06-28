import { create } from 'zustand'
import { post } from '../api/request'

interface AuthStore {
  isLoggedIn: boolean
  username: string
  userId: string
  token: string
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoggedIn: (() => {
    const token = localStorage.getItem('app_token')
    const expireAt = Number(localStorage.getItem('app_expire_at') || '0')
    if (!token || Date.now() > expireAt) {
      localStorage.removeItem('app_token')
      localStorage.removeItem('app_username')
      localStorage.removeItem('app_user_id')
      localStorage.removeItem('app_expire_at')
      return false
    }
    return true
  })(),
  username: localStorage.getItem('app_username') || '',
  userId: localStorage.getItem('app_user_id') || '',
  token: localStorage.getItem('app_token') || '',

  login: async (username, password) => {
    try {
      const res = await post<{ token: string; username: string; expireAt: number }>(
        '/api/v1/login',
        { username, password },
      )
      if (res.code !== '0000') return { success: false, error: res.info || '登录失败' }
      const { token, expireAt } = res.data!
      const userId = `user_${username}`
      localStorage.setItem('app_token', token)
      localStorage.setItem('app_username', username)
      localStorage.setItem('app_user_id', userId)
      localStorage.setItem('app_expire_at', String(expireAt))
      set({ isLoggedIn: true, username, userId, token })
      return { success: true }
    } catch {
      return { success: false, error: '网络错误，请重试' }
    }
  },

  logout: () => {
    const token = get().token
    fetch('/api/v1/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => {})
    localStorage.removeItem('app_token')
    localStorage.removeItem('app_username')
    localStorage.removeItem('app_user_id')
    localStorage.removeItem('app_expire_at')
    set({ isLoggedIn: false, username: '', userId: '', token: '' })
  },
}))
