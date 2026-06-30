import { useRef, useState } from 'react'
import { Square, Globe } from 'lucide-react'
import { useAppStore } from '../stores/appStore'

export function ChatInputBar() {
  const { sendMessage, stopStream, isLoading, webSearchEnabled, setWebSearchEnabled } = useAppStore()
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = async () => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    setText('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    await sendMessage(trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 100) + 'px'
  }

  const canSend = text.trim().length > 0 && !isLoading

  return (
    <div style={{ background: 'white', borderTop: '1px solid #f3f4f6', padding: '10px 14px 12px', flexShrink: 0 }}>
      {webSearchEnabled && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px', color: '#3b82f6', fontSize: '12px', fontWeight: 500 }}>
          <Globe size={12} /> 联网搜索已开启
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f2f2f7', borderRadius: '22px', padding: '8px 14px', border: 'none' }}>
        <button
          onClick={() => setWebSearchEnabled(!webSearchEnabled)}
          title={webSearchEnabled ? '关闭联网搜索' : '开启联网搜索'}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: webSearchEnabled ? '#3b82f6' : '#9ca3af', flexShrink: 0, display: 'flex', alignItems: 'center' }}
        >
          <Globe size={18} />
        </button>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={webSearchEnabled ? '发送消息…（联网搜索已开启）' : '发送消息…'}
          rows={1}
          style={{ flex: 1, background: 'transparent', resize: 'none', outline: 'none', border: 'none', fontSize: '15px', color: '#111827', fontFamily: 'inherit', lineHeight: '1.4', maxHeight: '100px', overflowY: 'auto', padding: '2px 0' }}
        />
        {isLoading ? (
          <button
            onClick={stopStream}
            style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <Square className="w-3.5 h-3.5 fill-white text-white" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!canSend}
            style={{ width: '34px', height: '34px', borderRadius: '50%', background: canSend ? '#3b82f6' : '#cbd5e1', border: 'none', cursor: canSend ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-3.5 h-3.5" style={{ marginLeft: '1px' }}>
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
