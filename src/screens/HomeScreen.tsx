import { useAuthStore } from '../stores/authStore'
import { useAppStore } from '../stores/appStore'

export function HomeScreen() {
  const { username } = useAuthStore()
  const { agents, sessions, setScreen } = useAppStore()
  const initials = username ? username.slice(0, 2).toUpperCase() : 'U'
  const msgCount = sessions.reduce((s, v) => s + v.messages.length, 0)

  const quickCards = [
    {
      label: 'AI 对话',
      desc: '智能解答疑问',
      iconBg: '#eff6ff',
      stroke: '#3b82f6',
      onClick: () => setScreen('chat'),
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" className="w-4 h-4">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      label: '业务大厅',
      desc: '自助快速办理',
      iconBg: '#f0fdf4',
      stroke: '#10b981',
      onClick: () => setScreen('biz'),
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" className="w-4 h-4">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
      ),
    },
    {
      label: '账单查询',
      desc: '查看消费明细',
      iconBg: '#fefce8',
      stroke: '#ca8a04',
      onClick: () => setScreen('biz'),
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="1.8" className="w-4 h-4">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      label: '个人中心',
      desc: '设置与偏好',
      iconBg: '#fdf4ff',
      stroke: '#a855f7',
      onClick: () => setScreen('profile'),
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.8" className="w-4 h-4">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ]

  return (
    <div className="h-full overflow-y-auto" style={{ background: '#f2f2f7' }}>
      {/* Dark gradient header */}
      <div style={{ background: 'linear-gradient(160deg,#0f172a 0%,#1e3a5f 100%)', padding: '0 20px 32px' }}>
        <div style={{ height: '64px' }} />
        <div style={{ height: '24px' }} />
        <div className="flex items-center justify-between mb-6">
          <div>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>欢迎回来</p>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'white', letterSpacing: '-0.2px', marginTop: '2px' }}>{username}</h2>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: '600' }}>
            {initials}
          </div>
        </div>
        {/* Stats card */}
        <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px', display: 'flex', justifyContent: 'space-around' }}>
          <div className="text-center">
            <p style={{ fontSize: '22px', fontWeight: '700', color: 'white' }}>{sessions.length}</p>
            <p style={{ fontSize: '10px', color: '#64748b', fontWeight: '500', marginTop: '2px' }}>历史对话</p>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div className="text-center">
            <p style={{ fontSize: '22px', fontWeight: '700', color: 'white' }}>{msgCount}</p>
            <p style={{ fontSize: '10px', color: '#64748b', fontWeight: '500', marginTop: '2px' }}>消息总数</p>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div className="text-center">
            <p style={{ fontSize: '22px', fontWeight: '700', color: 'white' }}>{agents.length || 2}</p>
            <p style={{ fontSize: '10px', color: '#64748b', fontWeight: '500', marginTop: '2px' }}>智能体</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        {/* AI ready card */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '14px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-2.5">
            <div style={{ width: '36px', height: '36px', background: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" className="w-4 h-4">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>AI 助手就绪</p>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>{agents.length || 2} 个智能体在线</p>
            </div>
          </div>
          <button
            onClick={() => setScreen('chat')}
            style={{ padding: '7px 14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', flexShrink: 0 }}
          >
            对话
          </button>
        </div>

        <p style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', padding: '0 2px' }}>快速服务</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingBottom: '24px' }}>
          {quickCards.map((card) => (
            <button
              key={card.label}
              onClick={card.onClick}
              style={{ background: 'white', borderRadius: '14px', padding: '16px', textAlign: 'left', border: 'none', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              <div style={{ width: '36px', height: '36px', background: card.iconBg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                {card.svg}
              </div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{card.label}</p>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', lineHeight: '1.4' }}>{card.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
