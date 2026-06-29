import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Copy, Check } from 'lucide-react'
import type { ChatMessage } from '../types'

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const lang = className?.replace('language-', '') ?? ''
  const copy = useCallback(() => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    })
  }, [children])

  return (
    <div className="relative my-2 rounded-xl overflow-hidden">
      {lang && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#16161F]">
          <span className="text-[10px] text-[#6e6e8a] font-mono uppercase">{lang}</span>
          <button onClick={copy} className="flex items-center gap-1 text-[10px] text-[#6e6e8a] active:text-white">
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            {copied ? '已复制' : '复制'}
          </button>
        </div>
      )}
      {!lang && (
        <button onClick={copy} className="absolute top-2 right-2 bg-[#2d2d3d] px-2 py-1 rounded text-[10px] text-[#6e6e8a] flex items-center gap-1">
          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
        </button>
      )}
      <pre className="!m-0 !rounded-none overflow-x-auto bg-[#1E1E2E] p-3">
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
        <div style={{ background: '#3b82f6', color: 'white', borderRadius: '18px 4px 18px 18px', padding: '10px 14px', maxWidth: '78%', wordBreak: 'break-word', boxShadow: '0 1px 3px rgba(59,130,246,0.3)' }}>
          <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', alignItems: 'flex-end' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '600', flexShrink: 0 }}>
        AI
      </div>
      <div style={{ background: 'white', borderRadius: '4px 18px 18px 18px', padding: '10px 14px', maxWidth: '82%', wordBreak: 'break-word', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        {message.streaming && !message.content ? (
          <div className="flex items-center gap-1 py-1">
            {[0, 160, 320].map((d) => (
              <span key={d} style={{ width: '7px', height: '7px', background: '#3b82f6', borderRadius: '50%', display: 'inline-block', animation: 'msgBounce 1.2s ease-in-out infinite', animationDelay: `${d}ms` }} />
            ))}
          </div>
        ) : (
          <div className="app-prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code({ children, className, ...rest }) {
                  if (!className) return <code className="font-mono" {...rest}>{children}</code>
                  return <CodeBlock className={className}>{String(children).replace(/\n$/, '')}</CodeBlock>
                },
                pre({ children }) { return <>{children}</> },
                a({ href, children }) {
                  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                },
              }}
            >
              {message.content || ''}
            </ReactMarkdown>
            {message.streaming && (
              <span className="inline-block w-0.5 h-4 bg-[#3b82f6] ml-0.5 cursor-blink align-text-bottom" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
