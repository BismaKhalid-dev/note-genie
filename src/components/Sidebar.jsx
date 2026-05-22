import { FileText, CreditCard, HelpCircle, MessageSquare, Zap, X } from 'lucide-react'

const tabs = [
  { id: 'summary',    label: 'Summary',    icon: FileText },
  { id: 'flashcards', label: 'Flashcards', icon: CreditCard },
  { id: 'quiz',       label: 'Quiz',       icon: HelpCircle },
  { id: 'chat',       label: 'Chat',       icon: MessageSquare },
]

export default function Sidebar({ active, onChange, hasContent, open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="sidebar-overlay animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen w-[260px] flex flex-col z-50
        bg-slate-950/98 border-r border-white/[0.07] backdrop-blur-xl
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/[0.07] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg
                              bg-gradient-to-br from-amber-400 to-orange-500
                              shadow-[0_0_20px_rgba(245,158,11,0.4)] flex-shrink-0">
                ✨
              </div>
              <span className="font-display text-xl font-bold text-white tracking-tight">
                Note<span className="text-amber-400">Genie</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest pl-12">
              AI Study Assistant
            </p>
          </div>
          {/* Close btn - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center
                       text-slate-500 hover:text-slate-200 hover:bg-white/[0.07]
                       rounded-lg transition-all mt-0.5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest
                        px-2 py-2 mt-1 mb-1">
            Features
          </p>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { onChange(id); onClose(); }}
              className={`nav-btn ${active === id ? 'active' : ''}`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center
                                flex-shrink-0 transition-all
                                ${active === id ? 'bg-amber-500/15' : 'bg-white/[0.04]'}`}>
                <Icon size={15} />
              </span>
              {label}
            </button>
          ))}

          {/* Status */}
          <div className="mt-5 mx-1">
            <div className={`rounded-xl p-3 border transition-all duration-300
              ${hasContent
                ? 'bg-emerald-500/8 border-emerald-500/20'
                : 'bg-white/[0.03] border-white/[0.06]'}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full flex-shrink-0
                  ${hasContent ? 'bg-emerald-400' : 'bg-slate-600'}`}
                  style={hasContent ? { boxShadow: '0 0 6px rgba(52,211,153,0.7)' } : {}} />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Notes Status
                </span>
              </div>
              <p className="text-xs text-slate-400 pl-4">
                {hasContent ? '✓ Notes loaded & ready' : 'No notes loaded yet'}
              </p>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <Zap size={11} className="text-amber-500" />
            Powered by Gemini AI
          </div>
        </div>
      </aside>
    </>
  )
}
