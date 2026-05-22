
import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { chat } from '../api'

const WELCOME = {
  role: 'ai',
  text: "Hi! I'm NoteGenie 👋 Load your notes first, then ask me anything — concepts, summaries, or clarifications."
}

export default function ChatView({ content }) {
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [history, setHistory]   = useState([])
  const bottomRef               = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const msg = input.trim()
    if (!msg || loading) return
    if (!content) {
      toast.error('Please load your notes first!')
      return
    }
    setInput('')
    setMessages(m => [...m, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const data = await chat(content, history, msg)
      setMessages(m => [...m, { role: 'ai', text: data.reply }])
      setHistory(h => [...h,
        { role: 'user', text: msg },
        { role: 'assistant', text: data.reply }
      ])
    } catch (e) {
      toast.error(`Chat error: ${e.message}`)
      setMessages(m => [...m, { role: 'ai', text: `⚠️ ${e.message}` }])
    } finally { setLoading(false) }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const onInput = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'
  }

  const clearChat = () => {
    setMessages([WELCOME]); setHistory([])
    toast('Chat cleared', { icon: '🗑️' })
  }

  return (
    <div className="animate-fade-up flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-semibold text-white">Chat with your notes</h2>
          <p className="text-xs text-slate-500 mt-0.5">Ask anything about your study material</p>
        </div>
        <button onClick={clearChat} className="btn-ghost text-xs !px-3 !py-2">Clear</button>
      </div>

      <div className="card flex flex-col overflow-hidden"
           style={{ height: 'clamp(340px, 50vh, 520px)' }}>
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 sm:gap-3 animate-fade-up
                                     ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
                               flex-shrink-0 text-sm font-semibold
                ${m.role === 'ai'
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900'
                  : 'bg-slate-700 text-slate-200'}`}>
                {m.role === 'ai' ? '✨' : 'U'}
              </div>
              <div className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3
                               text-xs sm:text-sm leading-relaxed
                ${m.role === 'ai'
                  ? 'bg-white/[0.05] border border-white/[0.08] text-slate-200 rounded-tl-sm'
                  : 'bg-amber-500/15 border border-amber-500/25 text-amber-100 rounded-tr-sm'}`}>
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 sm:gap-3 animate-fade-up">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500
                              flex items-center justify-center text-sm text-slate-900">✨</div>
              <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-tl-sm
                              px-4 py-3 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-400 dot-1" />
                <div className="w-2 h-2 rounded-full bg-slate-400 dot-2" />
                <div className="w-2 h-2 rounded-full bg-slate-400 dot-3" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-white/[0.07] p-3 flex items-end gap-2.5">
          <textarea
            value={input} onInput={onInput}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder={content ? 'Ask anything about your notes…' : 'Load notes first…'}
            disabled={loading} rows={1}
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-600
                       text-sm outline-none resize-none leading-relaxed py-1 max-h-24"
          />
          <button onClick={send} disabled={!input.trim() || loading}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500 hover:bg-amber-400
                       disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center
                       transition-all duration-150 flex-shrink-0 active:scale-95">
            <Send size={14} className="text-slate-900" />
          </button>
        </div>
      </div>

      {!content && (
        <p className="text-center text-xs text-slate-600">
          ✨ Load your notes from the input panel above to start chatting
        </p>
      )}
    </div>
  )
}
