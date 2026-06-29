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
): () => void {
  return streamPost('/api/v1/chat_stream', { agentId, userId, sessionId, message }, onChunk, onDone, onError)
}
