import { useState } from 'react'
import { LogOut, Server, ChevronRight, User, Loader2, Plus, Trash2, Check, X } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { getBaseUrl, setBaseUrl } from '../api/request'
import { useAppStore } from '../stores/appStore'
import { loadConfigs, saveConfigs, getActiveConfigId, setActiveConfig } from '../utils/modelConfig'
import type { ModelConfigEntry } from '../types'

function genId() { return Math.random().toString(36).slice(2) }

export function SettingsScreen() {
  const { username, logout } = useAuthStore()
  const agents = useAppStore((s) => s.agents)
  const [serverUrl, setServerUrlState] = useState(getBaseUrl())
  const [savedUrl, setSavedUrl] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // model config panel
  const [modelPanelAgentId, setModelPanelAgentId] = useState<string | null>(null)
  const [configs, setConfigs] = useState<ModelConfigEntry[]>([])
  const [activeId, setActiveIdState] = useState<string | null>(null)
  const [editEntry, setEditEntry] = useState<ModelConfigEntry | null>(null)
  const [saving, setSaving] = useState(false)

  const openModelPanel = (agentId: string) => {
    setModelPanelAgentId(agentId)
    setConfigs(loadConfigs(agentId))
    setActiveIdState(getActiveConfigId(agentId))
    setEditEntry(null)
  }

  const handleSaveEntry = () => {
    if (!editEntry || !modelPanelAgentId) return
    const existing = configs.find((c) => c.id === editEntry.id)
    let updated: ModelConfigEntry[]
    if (existing) {
      updated = configs.map((c) => c.id === editEntry.id ? editEntry : c)
    } else {
      updated = [...configs, editEntry]
    }
    saveConfigs(modelPanelAgentId, updated)
    setConfigs(updated)
    setEditEntry(null)
  }

  const handleDeleteEntry = (id: string) => {
    if (!modelPanelAgentId) return
    const updated = configs.filter((c) => c.id !== id)
    saveConfigs(modelPanelAgentId, updated)
    setConfigs(updated)
    if (activeId === id) setActiveIdState(null)
  }

  const handleSelectConfig = async (id: string) => {
    if (!modelPanelAgentId) return
    setSaving(true)
    await setActiveConfig(modelPanelAgentId, id)
    setActiveIdState(id)
    setSaving(false)
  }

  const handleSaveServer = () => {
    setBaseUrl(serverUrl)
    setSavedUrl(true)
    setTimeout(() => setSavedUrl(false), 1500)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="safe-top shrink-0 px-5 pt-4 pb-3">
        <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">设置</h1>
      </div>

      <div className="flex-1 overflow-y-auto scroll-area scrollbar-hide px-4 pb-6 flex flex-col gap-4">
        {/* Account */}
        <div className="bg-white rounded-2xl border border-[#F0EBE3] overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-9 h-9 rounded-full bg-[#1A1A1A] flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1A1A1A]">{username}</p>
              <p className="text-xs text-[#999]">当前登录账户</p>
            </div>
          </div>
          <div className="border-t border-[#F5F2EC]">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500 active:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">退出登录</span>
            </button>
          </div>
        </div>

        {/* Server URL */}
        <div className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-3.5 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-4 h-4 text-[#CC785C]" />
            <span className="text-sm font-semibold text-[#1A1A1A]">后端服务器</span>
          </div>
          <input
            type="url"
            value={serverUrl}
            onChange={(e) => setServerUrlState(e.target.value)}
            placeholder="http://localhost:8092"
            className="w-full h-10 rounded-xl border border-[#E5E1DA] px-3 text-sm text-[#1A1A1A] placeholder-[#BBB] outline-none focus:border-[#CC785C] transition-all"
          />
          <button
            onClick={handleSaveServer}
            className={`h-9 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
              savedUrl ? 'bg-green-500 text-white' : 'bg-[#1A1A1A] text-white'
            }`}
          >
            {savedUrl ? '已保存 ✓' : '保存'}
          </button>
        </div>

        {/* Model config per agent */}
        {agents.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#F0EBE3] overflow-hidden">
            <p className="px-4 py-3 text-xs font-semibold text-[#999] uppercase tracking-wider border-b border-[#F5F2EC]">
              模型配置
            </p>
            {agents.map((agent, i) => (
              <button
                key={agent.agentId}
                onClick={() => openModelPanel(agent.agentId)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-[#F9F6F2] transition-colors ${
                  i > 0 ? 'border-t border-[#F5F2EC]' : ''
                }`}
              >
                <span className="flex-1 text-sm text-[#1A1A1A]">{agent.agentName}</span>
                <ChevronRight className="w-4 h-4 text-[#CCC]" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Logout confirm */}
      {showLogoutConfirm && (
        <div className="absolute inset-0 z-50 flex items-end bg-black/40" onClick={() => setShowLogoutConfirm(false)}>
          <div className="w-full bg-white rounded-t-2xl p-5 pb-8" onClick={(e) => e.stopPropagation()}>
            <p className="text-base font-bold text-[#1A1A1A] mb-1">退出登录</p>
            <p className="text-sm text-[#666] mb-5">确定要退出登录吗？</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 h-12 rounded-2xl border border-[#E5E1DA] text-sm font-semibold text-[#1A1A1A] active:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => { setShowLogoutConfirm(false); logout() }}
                className="flex-1 h-12 rounded-2xl bg-red-500 text-white text-sm font-semibold active:bg-red-600"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model config sheet */}
      {modelPanelAgentId && (
        <div className="absolute inset-0 z-50 flex flex-col bg-[#FAF9F7]">
          <div className="safe-top shrink-0 flex items-center gap-3 px-4 pt-4 pb-3 border-b border-[#E5E1DA] bg-white">
            <button onClick={() => { setModelPanelAgentId(null); setEditEntry(null) }} className="text-[#CC785C] text-sm font-medium active:opacity-60">
              返回
            </button>
            <span className="flex-1 text-center text-sm font-semibold text-[#1A1A1A]">
              {agents.find((a) => a.agentId === modelPanelAgentId)?.agentName} 模型配置
            </span>
            <button
              onClick={() => setEditEntry({ id: genId(), name: '', baseUrl: 'https://api.deepseek.com', apiKey: '', model: 'deepseek-chat' })}
              className="text-[#CC785C] active:opacity-60"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scroll-area px-4 py-4 flex flex-col gap-3">
            {configs.length === 0 && !editEntry && (
              <p className="text-sm text-center text-[#999] mt-8">暂无配置，点击右上角 + 添加</p>
            )}

            {configs.map((cfg) => (
              <div key={cfg.id} className={`bg-white rounded-2xl border px-4 py-3.5 flex items-center gap-3 ${activeId === cfg.id ? 'border-[#CC785C]' : 'border-[#E5E1DA]'}`}>
                <button onClick={() => handleSelectConfig(cfg.id)} className="flex-1 text-left flex items-center gap-2">
                  {activeId === cfg.id ? (
                    <div className="w-5 h-5 rounded-full bg-[#CC785C] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-[#CCC] shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{cfg.name || cfg.model}</p>
                    <p className="text-xs text-[#999] mt-0.5">{cfg.baseUrl} · {cfg.model}</p>
                  </div>
                </button>
                <button onClick={() => setEditEntry({ ...cfg })} className="text-[#CC785C] active:opacity-60 p-1">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteEntry(cfg.id)} className="text-red-400 active:opacity-60 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {saving && (
              <div className="flex items-center justify-center gap-2 text-[#999] text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> 同步中…
              </div>
            )}

            {/* Edit form */}
            {editEntry && (
              <div className="bg-white rounded-2xl border border-[#E5E1DA] px-4 py-4 flex flex-col gap-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-[#1A1A1A]">{configs.find((c) => c.id === editEntry.id) ? '编辑配置' : '新增配置'}</p>
                  <button onClick={() => setEditEntry(null)} className="text-[#999] active:opacity-60"><X className="w-4 h-4" /></button>
                </div>
                {[
                  { label: '配置名称', field: 'name' as const, placeholder: '例：DeepSeek 官方' },
                  { label: '服务地址 (Base URL)', field: 'baseUrl' as const, placeholder: 'https://api.deepseek.com' },
                  { label: 'API Key', field: 'apiKey' as const, placeholder: 'sk-...' },
                  { label: '模型名称', field: 'model' as const, placeholder: 'deepseek-chat' },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <p className="text-xs font-medium text-[#666] mb-1">{label}</p>
                    <input
                      type={field === 'apiKey' ? 'password' : 'text'}
                      value={editEntry[field]}
                      onChange={(e) => setEditEntry({ ...editEntry, [field]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full h-10 rounded-xl border border-[#E5E1DA] px-3 text-sm text-[#1A1A1A] placeholder-[#BBB] outline-none focus:border-[#CC785C] transition-all"
                    />
                  </div>
                ))}
                <button
                  onClick={handleSaveEntry}
                  disabled={!editEntry.baseUrl.trim() || !editEntry.model.trim()}
                  className="h-10 rounded-xl bg-[#1A1A1A] text-white text-sm font-semibold disabled:opacity-40 active:scale-[0.98] transition-all"
                >
                  保存
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
