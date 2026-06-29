import { useState, useEffect } from 'react'
import { LogOut, Server, ChevronRight, User, Loader2 } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { getBaseUrl, setBaseUrl } from '../api/request'
import { getModelConfig, updateModelConfig } from '../api/agentApi'
import { useAppStore } from '../stores/appStore'

export function SettingsScreen() {
  const { username, userId, logout } = useAuthStore()
  const agents = useAppStore((s) => s.agents)
  const [serverUrl, setServerUrlState] = useState(getBaseUrl())
  const [savedUrl, setSavedUrl] = useState(false)
  const [showModelPanel, setShowModelPanel] = useState<string | null>(null)
  const [baseUrl, setBaseUrlField] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('')
  const [loadingConfig, setLoadingConfig] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveOk, setSaveOk] = useState(false)

  const handleSaveServer = () => {
    setBaseUrl(serverUrl)
    setSavedUrl(true)
    setTimeout(() => setSavedUrl(false), 1500)
  }

  const openModelConfig = async (agentId: string) => {
    setShowModelPanel(agentId)
    setBaseUrlField('')
    setApiKey('')
    setModel('')
    setSaveOk(false)
    setLoadingConfig(true)
    try {
      const cfg = await getModelConfig(agentId, userId)
      if (cfg) {
        setBaseUrlField(cfg.baseUrl ?? '')
        setApiKey(cfg.apiKey ?? '')
        setModel(cfg.model ?? '')
      } else {
        setBaseUrlField('https://api.deepseek.com')
        setModel('deepseek-chat')
      }
    } catch {
      setBaseUrlField('https://api.deepseek.com')
      setModel('deepseek-chat')
    } finally {
      setLoadingConfig(false)
    }
  }

  const handleSaveModel = async () => {
    if (!showModelPanel || !baseUrl.trim() || !model.trim()) return
    setSaving(true)
    await updateModelConfig(userId, showModelPanel, baseUrl.trim(), apiKey.trim(), model.trim())
    setSaving(false)
    setSaveOk(true)
    setTimeout(() => { setShowModelPanel(null); setSaveOk(false) }, 1000)
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
              onClick={logout}
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
              模型配置（按账户隔离）
            </p>
            {agents.map((agent, i) => (
              <button
                key={agent.agentId}
                onClick={() => openModelConfig(agent.agentId)}
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

      {/* Model config sheet */}
      {showModelPanel && (
        <div className="absolute inset-0 z-50 flex flex-col bg-[#FAF9F7]">
          <div className="safe-top shrink-0 flex items-center gap-3 px-4 pt-4 pb-3 border-b border-[#E5E1DA] bg-white">
            <button onClick={() => setShowModelPanel(null)} className="text-[#CC785C] text-sm font-medium active:opacity-60">取消</button>
            <span className="flex-1 text-center text-sm font-semibold text-[#1A1A1A]">
              {agents.find((a) => a.agentId === showModelPanel)?.agentName}
            </span>
            <button
              onClick={handleSaveModel}
              disabled={saving || loadingConfig}
              className={`text-sm font-semibold active:opacity-60 ${saveOk ? 'text-green-500' : 'text-[#CC785C]'}`}
            >
              {saving ? '保存中…' : saveOk ? '已保存' : '保存'}
            </button>
          </div>

          {loadingConfig ? (
            <div className="flex-1 flex items-center justify-center gap-2 text-[#999]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">加载配置中…</span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scroll-area px-4 py-5 flex flex-col gap-3">
              {[
                { label: '服务地址 (Base URL)', value: baseUrl, setter: setBaseUrlField, placeholder: 'https://api.openai.com/v1' },
                { label: 'API Key', value: apiKey, setter: setApiKey, placeholder: 'sk-...' },
                { label: '模型名称 (Model)', value: model, setter: setModel, placeholder: 'deepseek-chat / gpt-4o' },
              ].map(({ label, value, setter, placeholder }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#666] px-1">{label}</label>
                  <input
                    type={label.includes('Key') ? 'password' : 'text'}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className="h-11 rounded-xl border border-[#E5E1DA] bg-white px-3 text-sm text-[#1A1A1A] placeholder-[#BBB] outline-none focus:border-[#CC785C] transition-all"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
