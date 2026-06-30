import { create } from 'zustand'
import type { AgentConfig, ChatMessage, ChatSession, Screen } from '../types'
import * as agentApi from '../api/agentApi'
import { useAuthStore } from './authStore'
import { getActiveConfig } from '../utils/modelConfig'

interface AppStore {
  screen: Screen
  setScreen: (s: Screen) => void

  agents: AgentConfig[]
  fetchAgents: () => Promise<void>

  activeAgentId: string | null
  activeSessionId: string | null

  webSearchEnabled: boolean
  setWebSearchEnabled: (v: boolean) => void

  showModelConfigPrompt: boolean
  setShowModelConfigPrompt: (v: boolean) => void

  sessions: ChatSession[]
  createSession: (agentId: string) => Promise<string>
  fetchSessions: (agentId: string) => Promise<void>
  restoreSession: (sessionId: string) => Promise<void>

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

  webSearchEnabled: false,
  setWebSearchEnabled: (v) => set({ webSearchEnabled: v }),
  showModelConfigPrompt: false,
  setShowModelConfigPrompt: (v) => set({ showModelConfigPrompt: v }),

  sessions: [],

  fetchSessions: async (agentId) => {
    const userId = useAuthStore.getState().userId
    try {
      const records = await agentApi.getSessions(userId, agentId)
      set((s) => {
        const existing = new Map(s.sessions.map((sess) => [sess.id, sess]))
        for (const r of records) {
          if (!existing.has(r.sessionId)) {
            existing.set(r.sessionId, {
              id: r.sessionId,
              agentId: r.agentId,
              name: r.title || `对话 ${existing.size + 1}`,
              messages: [],
              createdAt: new Date(r.createdAt).getTime(),
            })
          }
        }
        return { sessions: Array.from(existing.values()).sort((a, b) => b.createdAt - a.createdAt) }
      })
    } catch {
      // ignore
    }
  },

  restoreSession: async (sessionId) => {
    const session = get().sessions.find((s) => s.id === sessionId)
    if (!session || session.messages.length > 0) {
      set({ activeSessionId: sessionId })
      return
    }
    try {
      const records = await agentApi.getSessionMessages(sessionId)
      set((s) => ({
        activeSessionId: sessionId,
        sessions: s.sessions.map((sess) =>
          sess.id === sessionId
            ? {
                ...sess,
                messages: records.map((r, i) => ({
                  id: `${sessionId}_${i}`,
                  role: r.role as 'user' | 'assistant',
                  content: r.content,
                  timestamp: new Date(r.createdAt).getTime(),
                })),
              }
            : sess,
        ),
      }))
    } catch {
      set({ activeSessionId: sessionId })
    }
  },

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
      sessions: [newSession, ...s.sessions],
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
    const { activeAgentId, isLoading, webSearchEnabled } = get()
    const userId = useAuthStore.getState().userId
    if (!activeAgentId || isLoading || !text.trim()) return

    // 检查是否已配置模型
    const activeCfg = getActiveConfig(activeAgentId)
    if (!activeCfg) {
      set({ showModelConfigPrompt: true })
      return
    }

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
      const sess = get().sessions.find((s) => s.id === sessionId)
      if (sess && sess.name.startsWith('对话 ')) {
        const title = text.length > 20 ? text.substring(0, 20) + '…' : text
        set((s) => ({
          sessions: s.sessions.map((se) => se.id === sessionId ? { ...se, name: title } : se),
        }))
      }
    }
    const onError = () => {
      get().updateMessage(sessionId!, aiMsgId, accumulated || '响应失败，请重试', false)
      set({ isLoading: false, _abortFn: null })
    }

    const abort = agentApi.chatStream(activeAgentId, userId, sessionId, text, onChunk, onDone, onError, webSearchEnabled)
    set({ _abortFn: abort })
  },
}))
