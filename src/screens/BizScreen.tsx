import { useAppStore } from '../stores/appStore'

interface Service {
  label: string
  desc: string
  iconBg: string
  stroke: string
  prompt: string
  svg: React.ReactNode
}

const SERVICES: Service[] = [
  {
    label: '账单查询', desc: '查看账单明细', iconBg: '#eff6ff', stroke: '#3b82f6',
    prompt: '我想查询我的账单信息',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>,
  },
  {
    label: '订单查询', desc: '查询物流状态', iconBg: '#f0fdf4', stroke: '#10b981',
    prompt: '我想查询我的订单状态',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" className="w-4 h-4"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  },
  {
    label: '信息修改', desc: '修改账户设置', iconBg: '#fdf4ff', stroke: '#a855f7',
    prompt: '我想修改我的个人信息',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.8" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  },
  {
    label: '业务申请', desc: '开通新业务', iconBg: '#fefce8', stroke: '#ca8a04',
    prompt: '我想申请一项新业务',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="1.8" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
  },
  {
    label: '凭证开具', desc: '申请发票', iconBg: '#eff6ff', stroke: '#3b82f6',
    prompt: '我需要开具发票或证明文件',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" className="w-4 h-4"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  },
  {
    label: '投诉建议', desc: '反馈问题', iconBg: '#fef2f2', stroke: '#ef4444',
    prompt: '我有一个投诉要提交',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" className="w-4 h-4"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  },
]

export function BizScreen() {
  const { setScreen, sendMessage } = useAppStore()

  const handleService = async (prompt: string) => {
    setScreen('chat')
    // wait for agents to be loaded if needed, then send
    const trySend = async (retries = 10) => {
      const store = useAppStore.getState()
      if (store.activeAgentId) {
        await store.sendMessage(prompt)
      } else if (retries > 0) {
        setTimeout(() => trySend(retries - 1), 100)
      }
    }
    setTimeout(() => trySend(), 100)
  }

  return (
    <div className="h-full overflow-y-auto" style={{ background: '#f2f2f7', padding: '82px 16px 24px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', letterSpacing: '-0.2px', marginBottom: '4px' }}>业务办理</h2>
      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>选择服务，AI 助手快速为您办理</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {SERVICES.map((svc) => (
          <button
            key={svc.label}
            onClick={() => handleService(svc.prompt)}
            style={{ background: 'white', borderRadius: '14px', padding: '16px', textAlign: 'left', border: 'none', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'block' }}
          >
            <div style={{ width: '36px', height: '36px', background: svc.iconBg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              {svc.svg}
            </div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '3px' }}>{svc.label}</p>
            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>{svc.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
