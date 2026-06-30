import { useEffect, useRef } from 'react'
import { useAppStore } from '../stores/appStore'
import { MessageBubble } from '../components/MessageBubble'
import { ChatInputBar } from '../components/ChatInputBar'
import { Settings } from 'lucide-react'

export function ChatScreen() {
  const { activeAgentId, activeSessionId, agents, sessions, createSession, isLoading, showModelConfigPrompt, setShowModelConfigPrompt, setScreen } = useAppStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  const agent = agents.find((a) => a.agentId === activeAgentId)
  const currentSession = sessions.find((s) => s.id === activeSessionId)
  const messages = currentSession?.messages ?? []

  // Auto-create session when entering chat with no session
  useEffect(() => {
    if (activeAgentId && !activeSessionId) {
      createSession(activeAgentId)
    }
  }, [activeAgentId, activeSessionId, createSession])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, messages[messages.length - 1]?.content])

  const dot = (delay: string) => (
    <span style={{ width: '7px', height: '7px', background: '#3b82f6', borderRadius: '50%', display: 'inline-block', animation: 'msgBounce 1.2s ease-in-out infinite', animationDelay: delay }} />
  )

  return (
    <div className="h-full flex flex-col overflow-hidden relative" style={{ background: '#f2f2f7' }}>
      {/* 未配置模型提示 */}
      {showModelConfigPrompt && (
        <div className="absolute inset-0 z-40 flex items-end bg-black/40" onClick={() => setShowModelConfigPrompt(false)}>
          <div className="w-full bg-white rounded-t-2xl p-5 pb-8" onClick={(e) => e.stopPropagation()}>
            <p className="text-base font-bold text-[#1A1A1A] mb-1">请先配置模型</p>
            <p className="text-sm text-[#666] mb-5">对话前需要先在「设置」中配置可用的模型，请前往配置后再开始对话。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModelConfigPrompt(false)}
                className="flex-1 h-12 rounded-2xl border border-[#E5E1DA] text-sm font-semibold text-[#1A1A1A]"
              >
                取消
              </button>
              <button
                onClick={() => { setShowModelConfigPrompt(false); setScreen('profile') }}
                className="flex-1 h-12 rounded-2xl bg-[#1A1A1A] text-white text-sm font-semibold flex items-center justify-center gap-1.5"
              >
                <Settings className="w-4 h-4" /> 前往设置
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div style={{ height: '62px', background: 'white', flexShrink: 0 }} />
      <div style={{ background: 'white', borderBottom: '1px solid #f3f4f6', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div style={{ width: '36px', height: '36px', background: '#0f172a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" className="w-4 h-4">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
          </svg>
        </div>
        <div>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{agent?.agentName ?? '智能客服助手'}</p>
          <p style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '1px' }}>
            <span style={{ width: '5px', height: '5px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }} />
            在线
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '16px', minHeight: 0 }}>
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-32">
            <p style={{ fontSize: '13px', color: '#9ca3af' }}>发送消息开始对话</p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', marginBottom: '14px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '600', flexShrink: 0 }}>AI</div>
            <div style={{ background: 'white', borderRadius: '4px 14px 14px 14px', padding: '12px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', gap: '3px' }}>
              {dot('0ms')}{dot('160ms')}{dot('320ms')}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInputBar />
    </div>
  )
}
