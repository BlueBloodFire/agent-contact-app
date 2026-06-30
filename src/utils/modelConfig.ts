import type { ModelConfigEntry } from '../types'
import { updateModelConfig } from '../api/agentApi'
import { useAuthStore } from '../stores/authStore'

const configsKey = (agentId: string) => `contact_model_configs_${agentId}`
const activeKey = (agentId: string) => `contact_model_active_${agentId}`

export function loadConfigs(agentId: string): ModelConfigEntry[] {
  try {
    return JSON.parse(localStorage.getItem(configsKey(agentId)) ?? '[]')
  } catch {
    return []
  }
}

export function saveConfigs(agentId: string, configs: ModelConfigEntry[]) {
  localStorage.setItem(configsKey(agentId), JSON.stringify(configs))
}

export function getActiveConfigId(agentId: string): string | null {
  return localStorage.getItem(activeKey(agentId))
}

export function getActiveConfig(agentId: string): ModelConfigEntry | null {
  const configs = loadConfigs(agentId)
  const activeId = getActiveConfigId(agentId)
  return configs.find((c) => c.id === activeId) ?? null
}

export async function setActiveConfig(agentId: string, configId: string) {
  localStorage.setItem(activeKey(agentId), configId)
  const cfg = loadConfigs(agentId).find((c) => c.id === configId)
  if (!cfg) return
  const userId = useAuthStore.getState().userId
  await updateModelConfig(userId, agentId, cfg.baseUrl, cfg.apiKey, cfg.model)
}
