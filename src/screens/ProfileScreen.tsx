import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useAppStore } from '../stores/appStore'
import { SettingsScreen } from './SettingsScreen'
import { ChevronRight } from 'lucide-react'

const Toggle = ({ on, toggle }: { on: boolean; toggle: () => void }) => (
  <button
    onClick={toggle}
    style={{ width: '44px', height: '26px', borderRadius: '13px', display: 'flex', alignItems: 'center', padding: '2px', background: on ? '#3b82f6' : '#d1d5db', border: 'none', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
  >
    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'white', transform: on ? 'translateX(18px)' : 'translateX(0)', transition: 'transform 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
  </button>
)

export function ProfileScreen() {
  const { username, userId, logout } = useAuthStore()
  const { sessions } = useAppStore()
  const initials = username ? username.slice(0, 2).toUpperCase() : 'U'
  const msgCount = sessions.reduce((s, v) => s + v.messages.length, 0)

  const [eOn, setEOn] = useState(true)
  const [pOn, setPOn] = useState(true)
  const [aOn, setAOn] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  return (
    <div className="h-full overflow-y-auto relative" style={{ background: '#f2f2f7' }}>
      {/* Settings overlay */}
      {showSettings && (
        <div className="absolute inset-0 z-30" style={{ background: '#FAF9F7' }}>
          <div className="safe-top shrink-0 flex items-center gap-3 px-4 pt-4 pb-3 border-b border-[#E5E1DA] bg-white">
            <button onClick={() => setShowSettings(false)} className="text-[#CC785C] text-sm font-medium active:opacity-60">返回</button>
            <span className="flex-1 text-center text-sm font-semibold text-[#1A1A1A]">设置</span>
            <span className="w-8" />
          </div>
          <div className="h-[calc(100%-56px)] overflow-y-auto">
            <SettingsScreen />
          </div>
        </div>
      )}

      {/* Logout confirm */}
      {showLogoutConfirm && (
        <div className="absolute inset-0 z-40 flex items-end bg-black/40" onClick={() => setShowLogoutConfirm(false)}>
          <div className="w-full bg-white rounded-t-2xl p-5 pb-8" onClick={(e) => e.stopPropagation()}>
            <p className="text-base font-bold text-[#1A1A1A] mb-1">退出登录</p>
            <p className="text-sm text-[#666] mb-5">确定要退出登录吗？</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 h-12 rounded-2xl border border-[#E5E1DA] text-sm font-semibold text-[#1A1A1A]">取消</button>
              <button onClick={() => { setShowLogoutConfirm(false); logout() }} className="flex-1 h-12 rounded-2xl bg-red-500 text-white text-sm font-semibold">确认退出</button>
            </div>
          </div>
        </div>
      )}
      {/* Profile header */}
      <div style={{ background: 'white', padding: '86px 20px 24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>
          {initials}
        </div>
        <p style={{ fontSize: '17px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>{username}</p>
        <p style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '5px', height: '5px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }} />
          AI 助手在线
        </p>
        <div style={{ display: 'flex', gap: '24px', marginTop: '18px' }}>
          {[
            { val: sessions.length, label: '对话' },
            { val: msgCount, label: '消息' },
            { val: 2, label: '智能体' },
          ].map((item, i) => (
            <div key={item.label} style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              {i > 0 && <div style={{ width: '1px', background: '#f3f4f6', alignSelf: 'stretch' }} />}
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>{item.val}</p>
                <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Notifications */}
        <div style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          {[
            { label: '邮件通知', desc: '每日对话摘要', on: eOn, toggle: () => setEOn(!eOn) },
            { label: '桌面推送', desc: '重要事件提醒', on: pOn, toggle: () => setPOn(!pOn) },
            { label: 'AI 辅助增强', desc: '智能回复建议', on: aOn, toggle: () => setAOn(!aOn) },
          ].map((item, i) => (
            <div
              key={item.label}
              style={{ padding: '14px 16px', borderBottom: i < 2 ? '1px solid #f9fafb' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{item.label}</p>
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>{item.desc}</p>
              </div>
              <Toggle on={item.on} toggle={item.toggle} />
            </div>
          ))}
        </div>

        {/* Account info */}
        <div style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>用户 ID</span>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#9ca3af' }}>{userId?.slice(0, 12)}…</span>
          </div>
          <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>账号状态</span>
            <span style={{ fontSize: '12px', background: '#f0fdf4', color: '#10b981', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>正常</span>
          </div>
        </div>

        {/* Settings */}
        <button
          onClick={() => setShowSettings(true)}
          style={{ width: '100%', padding: '14px 16px', background: 'white', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#111827' }}
        >
          <span>设置 / 模型配置</span>
          <ChevronRight size={16} style={{ color: '#ccc' }} />
        </button>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          style={{ width: '100%', padding: '14px', background: 'white', color: '#ef4444', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: '8px' }}
        >
          退出登录
        </button>
      </div>
    </div>
  )
}
