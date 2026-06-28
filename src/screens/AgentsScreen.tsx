import { ChevronRight, Bot } from 'lucide-react'
import { useAppStore } from '../stores/appStore'

export function AgentsScreen() {
  const { agents, setActiveAgent } = useAppStore()

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="safe-top shrink-0 px-5 pt-4 pb-3">
        <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">智能体</h1>
        <p className="text-sm text-[#999] mt-0.5">选择一个智能体开始对话</p>
      </div>

      <div className="flex-1 overflow-y-auto scroll-area scrollbar-hide px-4 pb-4">
        {agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <Bot className="w-10 h-10 text-[#CCC]" />
            <p className="text-sm text-[#999]">暂无智能体</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {agents.map((agent) => (
              <button
                key={agent.agentId}
                onClick={() => setActiveAgent(agent.agentId)}
                className="w-full flex items-center gap-3.5 bg-white rounded-2xl px-4 py-3.5 text-left active:scale-[0.98] transition-all border border-[#F0EBE3] shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[#CC785C]/10 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-[#CC785C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1A1A1A] truncate">{agent.agentName}</p>
                  {agent.agentDesc && (
                    <p className="text-xs text-[#999] mt-0.5 truncate">{agent.agentDesc}</p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-[#CCC] shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
