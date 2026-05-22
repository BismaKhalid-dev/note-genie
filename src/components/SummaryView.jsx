
import { BookOpen, Tag, ChevronRight } from 'lucide-react'

function EmptySummary() {
  return (
    <div className="card flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4">
      <div className="text-4xl sm:text-5xl mb-4 opacity-30">📋</div>
      <p className="font-display text-base sm:text-lg text-slate-400 mb-2">Your summary will appear here</p>
      <p className="text-xs sm:text-sm text-slate-600">
        Load your notes and click <span className="text-amber-400 font-medium">Summary</span>
      </p>
    </div>
  )
}

export default function SummaryView({ data, loading, error }) {
  if (loading) return <LoadingCard label="Generating summary…" />
  if (error)   return <ErrorCard msg={error} />
  if (!data)   return <EmptySummary />

  const { overview, keyPoints = [], terms = [] } = data

  return (
    <div className="animate-fade-up space-y-4">
      {/* Overview */}
      <div className="card p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
            <BookOpen size={15} className="text-amber-400" />
          </div>
          <h2 className="font-display text-base sm:text-lg font-semibold text-white">Overview</h2>
        </div>
        <p className="text-slate-300 leading-relaxed text-sm">{overview}</p>
      </div>

      {/* Key Points + Terms — stack on mobile, side by side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Key Points */}
        <div className="card p-4 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-3 sm:mb-4">
            Key Points
          </p>
          <ul className="space-y-3">
            {keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-bold
                                  flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-slate-300 text-sm leading-relaxed">{point}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Terms */}
        {terms.length > 0 && (
          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Tag size={13} className="text-cyan-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Key Terms</p>
            </div>
            <div className="space-y-3">
              {terms.map((t, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-sm font-semibold text-slate-100 mb-1 flex items-center gap-1.5">
                    <ChevronRight size={12} className="text-amber-400 flex-shrink-0" /> {t.term}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed pl-4">{t.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function LoadingCard({ label }) {
  return (
    <div className="card flex flex-col items-center justify-center py-16 sm:py-20 gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-amber-400 animate-spin" />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  )
}

export function ErrorCard({ msg }) {
  return (
    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-300">
      ⚠️ {msg}
    </div>
  )
}
