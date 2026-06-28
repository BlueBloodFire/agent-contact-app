import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'

export function LoginScreen() {
  const login = useAuthStore((s) => s.login)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username.trim()) { setError('请输入用户名'); return }
    if (!password.trim()) { setError('请输入密码'); return }
    setLoading(true); setError('')
    const result = await login(username, password)
    setLoading(false)
    if (!result.success) setError(result.error || '登录失败')
  }

  return (
    <div className="h-dvh flex flex-col" style={{ background: 'white' }}>
      {/* Dark header */}
      <div style={{ background: '#0f172a', padding: '0 28px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ height: '64px', flexShrink: 0 }} />
        <div style={{ width: '56px', height: '56px', background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.35)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" className="w-6 h-6">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'white', letterSpacing: '-0.3px', marginBottom: '6px' }}>智能客服</h1>
        <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '400' }}>AI 驱动的一站式客服平台</p>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>用户名</label>
          <input
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="请输入用户名"
            style={{ width: '100%', padding: '13px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', color: '#111827', background: '#f9fafb', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="请输入密码"
            style={{ width: '100%', padding: '13px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', color: '#111827', background: '#f9fafb', boxSizing: 'border-box' }}
          />
        </div>
        {error && <p style={{ fontSize: '13px', color: '#ef4444' }}>{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', padding: '14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: '4px', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? '登录中…' : '登录'}
        </button>
        <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginTop: '4px' }}>请联系管理员获取账号</p>
      </div>
    </div>
  )
}
