import { get, post, streamPost } from './request'
import type { AgentConfig } from '../types'

export async function queryAgentList(): Promise<AgentConfig[]> {
  const res = await get<AgentConfig[]>('/api/v1/query_ai_agent_config_list')
  return res.data ?? []
}

export async function createSession(agentId: string, userId: string): Promise<string | null> {
  const res = await post<{ sessionId: string }>('/api/v1/create_session', { agentId, userId })
  return res.data?.sessionId ?? null
}

export async function getModelConfig(
  agentId: string,
  userId: string,
): Promise<{ baseUrl: string; apiKey: string; model: string } | null> {
  const res = await get<{ baseUrl: string; apiKey: string; model: string }>(
    `/api/v1/model_config?agentId=${encodeURIComponent(agentId)}&userId=${encodeURIComponent(userId)}`,
  )
  return res.data ?? null
}

export interface SessionRecord {
  sessionId: string
  agentId: string
  title: string
  turnCount: number
  createdAt: string
  updatedAt: string
}

export interface MessageRecord {
  messageId: string
  role: string
  content: string
  createdAt: string
}

export async function getSessions(userId: string, agentId?: string): Promise<SessionRecord[]> {
  const query = agentId
    ? `userId=${encodeURIComponent(userId)}&agentId=${encodeURIComponent(agentId)}`
    : `userId=${encodeURIComponent(userId)}`
  const res = await get<SessionRecord[]>(`/api/v1/sessions?${query}`)
  return res.data ?? []
}

export async function getSessionMessages(sessionId: string): Promise<MessageRecord[]> {
  const res = await get<MessageRecord[]>(`/api/v1/session/messages?sessionId=${encodeURIComponent(sessionId)}`)
  return res.data ?? []
}

export async function updateModelConfig(userId: string, agentId: string, baseUrl: string, apiKey: string, model: string) {
  return post('/api/v1/update_model_config', { userId, agentId, baseUrl, apiKey, model })
}

export function chatStream(
  agentId: string,
  userId: string,
  sessionId: string,
  message: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
  webSearch?: boolean,
): () => void {
  return streamPost('/api/v1/chat_stream', { agentId, userId, sessionId, message, webSearch: webSearch ?? false }, onChunk, onDone, onError)
}
