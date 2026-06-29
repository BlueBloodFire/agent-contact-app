import { create } from 'zustand'
import type { AgentConfig, ChatMessage, ChatSession, Screen } from '../types'
import * as agentApi from '../api/agentApi'
import { useAuthStore } from './authStore'

interface AppStore {
  screen: Screen
  setScreen: (s: Screen) => void

  agents: AgentConfig[]
  fetchAgents: () => Promise<void>

  activeAgentId: string | null
  activeSessionId: string | null

  sessions: ChatSession[]
  createSession: (agentId: string) => Promise<string>

  addMessage: (sessionId: string, msg: ChatMessage) => void
  updateMessage: (sessionId: string, msgId: string, content: string, streaming?: boolean) => void

  isLoading: boolean
  sendMessage: (text: string) => Promise<void>
  stopStream: () => void
  _abortFn: (() => void) | null
}

export const useAppStore = create<AppStore>((set, get) => ({
  screen: 'home',
  setScreen: (s) => set({ screen: s }),

  agents: [],
  fetchAgents: async () => {
    const list = await agentApi.queryAgentList()
    const current = get().activeAgentId
    set({
      agents: list,
      activeAgentId: current ?? list[0]?.agentId ?? null,
    })
  },

  activeAgentId: null,
  activeSessionId: null,

  sessions: [],

  createSession: async (agentId) => {
    const userId = useAuthStore.getState().userId
    const sessionId = await agentApi.createSession(agentId, userId)
    if (!sessionId) throw new Error('创建会话失败')
    const newSession: ChatSession = {
      id: sessionId,
      agentId,
      name: `对话 ${get().sessions.filter((s) => s.agentId === agentId).length + 1}`,
      messages: [],
      createdAt: Date.now(),
    }
    set((s) => ({
      sessions: [...s.sessions, newSession],
      activeSessionId: sessionId,
    }))
    return sessionId
  },

  addMessage: (sessionId, msg) =>
    set((s) => ({
      sessions: s.sessions.map((sess) =>
        sess.id === sessionId ? { ...sess, messages: [...sess.messages, msg] } : sess,
      ),
    })),

  updateMessage: (sessionId, msgId, content, streaming) =>
    set((s) => ({
      sessions: s.sessions.map((sess) =>
        sess.id === sessionId
          ? {
              ...sess,
              messages: sess.messages.map((m) =>
                m.id === msgId ? { ...m, content, streaming: streaming ?? false } : m,
              ),
            }
          : sess,
      ),
    })),

  isLoading: false,
  _abortFn: null,

  stopStream: () => {
    const { _abortFn, activeSessionId } = get()
    if (_abortFn) { _abortFn(); set({ _abortFn: null }) }
    if (activeSessionId) {
      set((s) => ({
        isLoading: false,
        sessions: s.sessions.map((sess) =>
          sess.id === activeSessionId
            ? { ...sess, messages: sess.messages.map((m) => m.streaming ? { ...m, streaming: false } : m) }
            : sess,
        ),
      }))
    }
  },

  sendMessage: async (text) => {
    const { activeAgentId, isLoading } = get()
    const userId = useAuthStore.getState().userId
    if (!activeAgentId || isLoading || !text.trim()) return

    let sessionId = get().activeSessionId
    if (!sessionId) {
      sessionId = await get().createSession(activeAgentId)
    }

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }
    get().addMessage(sessionId, userMsg)
    set({ isLoading: true })

    const aiMsgId = `msg_${Date.now()}_ai`
    get().addMessage(sessionId, { id: aiMsgId, role: 'assistant', content: '', timestamp: Date.now(), streaming: true })

    let accumulated = ''
    const onChunk = (chunk: string) => {
      accumulated += chunk
      get().updateMessage(sessionId!, aiMsgId, accumulated, true)
    }
    const onDone = () => {
      get().updateMessage(sessionId!, aiMsgId, accumulated, false)
      set({ isLoading: false, _abortFn: null })
    }
    const onError = () => {
      get().updateMessage(sessionId!, aiMsgId, accumulated || '响应失败，请重试', false)
      set({ isLoading: false, _abortFn: null })
    }

    const abort = agentApi.chatStream(activeAgentId, userId, sessionId, text, onChunk, onDone, onError)
    set({ _abortFn: abort })
  },
}))
