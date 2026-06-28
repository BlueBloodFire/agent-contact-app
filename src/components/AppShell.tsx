import { useEffect } from 'react'
import { useAppStore } from '../stores/appStore'
import { HomeScreen } from '../screens/HomeScreen'
import { ChatScreen } from '../screens/ChatScreen'
import { BizScreen } from '../screens/BizScreen'
import { ProfileScreen } from '../screens/ProfileScreen'
import type { Screen } from '../types'

const TABS: { id: Screen; label: string; path: string }[] = [
  {
    id: 'home',
    label: '首页',
    path: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  },
  {
    id: 'chat',
    label: '对话',
    path: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  },
  {
    id: 'biz',
    label: '业务',
    path: 'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm0 0V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2',
  },
  {
    id: 'profile',
    label: '我的',
    path: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  },
]

export function AppShell() {
  const { screen, setScreen, fetchAgents } = useAppStore()

  useEffect(() => { fetchAgents() }, [fetchAgents])

  return (
    <div className="h-dvh flex flex-col overflow-hidden" style={{ background: '#f2f2f7', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {screen === 'home' && <HomeScreen />}
        {screen === 'chat' && <ChatScreen />}
        {screen === 'biz' && <BizScreen />}
        {screen === 'profile' && <ProfileScreen />}
      </div>

      {/* Bottom tab bar */}
      <div
        className="shrink-0 flex pb-safe"
        style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(0,0,0,0.06)' }}
      >
        {TABS.map(({ id, label, path }) => {
          const isActive = screen === id
          return (
            <button
              key={id}
              onClick={() => setScreen(id)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors cursor-pointer border-none bg-transparent"
              style={{ color: isActive ? '#3b82f6' : '#9ca3af' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? '2' : '1.8'} className="w-[22px] h-[22px]">
                {id === 'home' ? (
                  <>
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  </>
                ) : id === 'biz' ? (
                  <>
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </>
                ) : (
                  <path d={path} />
                )}
              </svg>
              <span style={{ fontSize: '10px', fontWeight: isActive ? '600' : '500', marginTop: '2px' }}>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
