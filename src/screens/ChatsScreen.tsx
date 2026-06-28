import { Bot, ChevronRight, Plus } from 'lucide-react'
import { useAppStore } from '../stores/appStore'

export function ChatsScreen() {
  const { agents, sessionsByAgent, setActiveAgent, setScreen, activeAgentId } = useAppStore()

  // Gather all sessions across agents, sorted by latest message time
  const allSessions = agents.flatMap((agent) =>
    (sessionsByAgent[agent.agentId] ?? []).map((sess) => ({ ...sess, agentName: agent.agentName }))
  ).sort((a, b) => b.createdAt - a.createdAt)

  const handleSelectSession = (agentId: string, sessionId: string) => {
    useAppStore.setState({ activeAgentId: agentId, activeSessionId: sessionId, screen: 'chat-detail' })
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="safe-top shrink-0 flex items-center justify-between px-5 pt-4 pb-3">
        <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">对话</h1>
        <button
          onClick={() => setScreen('agents')}
          className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center active:scale-90 transition-all"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scroll-area scrollbar-hide px-4 pb-4">
        {allSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-52 gap-3">
            <Bot className="w-12 h-12 text-[#DDD]" />
            <p className="text-sm text-[#999]">还没有对话记录</p>
            <button
              onClick={() => setScreen('agents')}
              className="px-4 py-2 bg-[#1A1A1A] text-white text-sm rounded-xl font-medium active:scale-95 transition-all"
            >
              开始新对话
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {allSessions.map((sess) => {
              const lastMsg = sess.messages[sess.messages.length - 1]
              const isActive = sess.id === (activeAgentId ? useAppStore.getState().activeSessionId : null)
              return (
                <button
                  key={sess.id}
                  onClick={() => handleSelectSession(sess.agentId, sess.id)}
                  className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left active:scale-[0.98] transition-all ${
                    isActive ? 'bg-[#F5F2EC]' : 'bg-white border border-[#F0EBE3]'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#CC785C]/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-[#CC785C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#1A1A1A] truncate">{sess.agentName}</p>
                      <span className="text-[10px] text-[#BBB] shrink-0">
                        {new Date(sess.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-[#999] mt-0.5 truncate">
                      {lastMsg ? (lastMsg.role === 'user' ? '我：' : '') + lastMsg.content : sess.name}
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#CCC] shrink-0" />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
