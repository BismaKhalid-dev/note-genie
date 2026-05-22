
import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from 'lucide-react'
import toast from 'react-hot-toast'
import { LoadingCard, ErrorCard } from './SummaryView'

function EmptyFlash() {
  return (
    <div className="card flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4">
      <div className="text-4xl sm:text-5xl mb-4 opacity-30">🃏</div>
      <p className="font-display text-base sm:text-lg text-slate-400 mb-2">Flashcards will appear here</p>
      <p className="text-xs sm:text-sm text-slate-600">
        Load your notes and click <span className="text-amber-400 font-medium">Flashcards</span>
      </p>
    </div>
  )
}

export default function FlashcardsView({ data, loading, error }) {
  const [idx, setIdx]      = useState(0)
  const [flipped, setFlip] = useState(false)
  const [cards, setCards]  = useState(null)

  if (loading) return <LoadingCard label="Generating flashcards…" />
  if (error)   return <ErrorCard msg={error} />
  if (!data)   return <EmptyFlash />

  const list = cards ?? data.cards ?? []
  const card = list[idx]

  const go = (dir) => {
    setFlip(false)
    setTimeout(() => setIdx(i => (i + dir + list.length) % list.length), 150)
  }

  const shuffle = () => {
    setCards([...list].sort(() => Math.random() - 0.5))
    toast('Cards shuffled! 🔀', { duration: 1800 })
    setIdx(0); setFlip(false)
  }

  const reset = () => { setCards(null); setIdx(0); setFlip(false); toast('Reset to original order', { icon: '↩️', duration: 1800 }) }

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-5">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-semibold text-white">Flashcards</h2>
          <p className="text-xs text-slate-500 mt-0.5">Tap the card to reveal the answer</p>
        </div>
        <div className="flex gap-2">
          <button onClick={shuffle} className="btn-ghost text-xs flex items-center gap-1.5 !px-3 !py-2">
            <Shuffle size={13} /> <span className="hidden sm:inline">Shuffle</span>
          </button>
          <button onClick={reset} className="btn-ghost text-xs flex items-center gap-1.5 !px-3 !py-2">
            <RotateCcw size={13} /> <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-5">
        {list.map((_, i) => (
          <div key={i} onClick={() => { setIdx(i); setFlip(false) }}
            className={`h-1 flex-1 rounded-full cursor-pointer transition-all duration-300
              ${i === idx ? 'bg-amber-400' : i < idx ? 'bg-amber-400/40' : 'bg-white/[0.08]'}`} />
        ))}
      </div>

      {/* Card — shorter on mobile */}
      <div className="perspective cursor-pointer mb-5"
           style={{ height: 'clamp(200px, 40vw, 280px)' }}
           onClick={() => setFlip(f => !f)}>
        <div className={`flip-card w-full h-full relative ${flipped ? 'flipped' : ''}`}>
          {/* Front */}
          <div className="flip-face absolute inset-0 rounded-2xl flex flex-col items-center justify-center
                          p-5 sm:p-8 text-center bg-gradient-to-br from-slate-800 to-slate-900
                          border border-white/[0.09]">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-4">Question</span>
            <p className="font-display text-base sm:text-xl font-semibold text-white leading-relaxed">
              {card.question}
            </p>
            <p className="text-[11px] text-slate-600 mt-5 flex items-center gap-1.5">
              <span className="animate-bounce inline-block">👆</span> Tap to flip
            </p>
          </div>
          {/* Back */}
          <div className="flip-face flip-back absolute inset-0 rounded-2xl flex flex-col items-center justify-center
                          p-5 sm:p-8 text-center bg-gradient-to-br from-amber-950/60 to-slate-900
                          border border-amber-500/20">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-500 mb-4">Answer</span>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">{card.answer}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button onClick={() => go(-1)}
          className="w-10 h-10 rounded-xl flex items-center justify-center btn-ghost !px-0 !py-0">
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-semibold text-slate-400 min-w-[60px] text-center">
          {idx + 1} <span className="text-slate-700">/</span> {list.length}
        </span>
        <button onClick={() => go(1)}
          className="w-10 h-10 rounded-xl flex items-center justify-center btn-ghost !px-0 !py-0">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* All cards grid — 1 col mobile, 2 col sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {list.map((c, i) => (
          <div key={i} onClick={() => { setIdx(i); setFlip(false) }}
            className={`card card-hover p-4 cursor-pointer transition-all duration-150
              ${i === idx ? 'border-amber-500/30 bg-amber-500/5' : ''}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-1.5">Q{i + 1}</p>
            <p className="text-sm text-slate-300 leading-relaxed">{c.question}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
