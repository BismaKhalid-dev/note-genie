
import { useState } from 'react'
import { CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react'
import toast from 'react-hot-toast'
import { LoadingCard, ErrorCard } from './SummaryView'

const KEYS = ['A', 'B', 'C', 'D']

function EmptyQuiz() {
  return (
    <div className="card flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4">
      <div className="text-4xl sm:text-5xl mb-4 opacity-30">🧩</div>
      <p className="font-display text-base sm:text-lg text-slate-400 mb-2">Your quiz will appear here</p>
      <p className="text-xs sm:text-sm text-slate-600">
        Load your notes and click <span className="text-amber-400 font-medium">Quiz</span>
      </p>
    </div>
  )
}

export default function QuizView({ data, loading, error }) {
  const [answers, setAnswers]   = useState({})
  const [revealed, setRevealed] = useState({})
  const [done, setDone]         = useState(false)

  if (loading) return <LoadingCard label="Generating quiz…" />
  if (error)   return <ErrorCard msg={error} />
  if (!data)   return <EmptyQuiz />

  const questions = data.questions ?? []
  const pick = (qIdx, optIdx) => {
    if (revealed[qIdx]) return
    setAnswers(a => ({ ...a, [qIdx]: optIdx }))
    setRevealed(r => ({ ...r, [qIdx]: true }))
  }

  const allAnswered = questions.length > 0 && Object.keys(revealed).length === questions.length
  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0)
  const pct   = Math.round((score / questions.length) * 100)
  const reset = () => { setAnswers({}); setRevealed({}); setDone(false); toast('Quiz reset! Try again 💪', { duration: 2000 }) }

  if (done && allAnswered) {
    const msg = pct >= 80 ? '🎉 Excellent work!' : pct >= 60 ? '👍 Good effort!' : '💪 Keep studying!'
    return (
      <div className="animate-fade-up">
        <div className="card p-6 sm:p-10 text-center mb-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-amber-500/30
                          flex flex-col items-center justify-center mx-auto mb-5">
            <p className="font-display text-3xl sm:text-4xl font-bold text-amber-400">{score}</p>
            <p className="text-xs text-slate-500">/ {questions.length}</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{pct}%</p>
          <p className="font-display text-base sm:text-lg text-slate-300 mb-5">{msg}</p>
          <button onClick={reset} className="btn-gold flex items-center gap-2 mx-auto">
            <RotateCcw size={15} /> Retake Quiz
          </button>
        </div>

        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Review</h3>
        <div className="space-y-3">
          {questions.map((q, qi) => {
            const correct = answers[qi] === q.correctIndex
            return (
              <div key={qi} className={`card p-4 border ${correct ? 'border-emerald-500/20' : 'border-rose-500/20'}`}>
                <div className="flex items-start gap-2 mb-2">
                  {correct
                    ? <CheckCircle size={15} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    : <XCircle    size={15} className="text-rose-400 mt-0.5 flex-shrink-0" />}
                  <p className="text-sm text-slate-200 font-medium leading-snug">{q.question}</p>
                </div>
                <p className="text-xs text-emerald-400 pl-5">✓ {q.options[q.correctIndex]}</p>
                {!correct && (
                  <p className="text-xs text-rose-400 pl-5 mt-0.5">
                    ✗ Your answer: {q.options[answers[qi]]}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-5">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-semibold text-white">Quiz</h2>
          <p className="text-xs text-slate-500 mt-0.5">{questions.length} questions</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm text-slate-400">
            {Object.keys(revealed).length}/{questions.length} answered
          </span>
          {allAnswered && (
            <button onClick={() => setDone(true)} className="btn-gold text-sm flex items-center gap-2">
              <Trophy size={14} /> Results
            </button>
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-5">
        {questions.map((q, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300
            ${!revealed[i] ? 'bg-white/[0.08]'
              : answers[i] === q.correctIndex ? 'bg-emerald-400' : 'bg-rose-400'}`} />
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, qi) => (
          <div key={qi} className="card p-4 sm:p-5">
            <div className="flex items-start gap-2 sm:gap-3 mb-4">
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-500/15 flex items-center justify-center
                               text-[10px] sm:text-xs font-bold text-amber-400 flex-shrink-0 mt-0.5">
                {qi + 1}
              </span>
              <p className="font-display text-sm sm:text-base font-semibold text-white leading-snug">
                {q.question}
              </p>
            </div>

            <div className="space-y-2 sm:pl-9">
              {q.options.map((opt, oi) => {
                const isCorrect  = oi === q.correctIndex
                const isSelected = answers[qi] === oi
                const isShown    = !!revealed[qi]

                let cls = 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:bg-white/[0.06] hover:border-white/15'
                if (isShown) {
                  if (isCorrect)       cls = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  else if (isSelected) cls = 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  else                 cls = 'bg-white/[0.02] border-white/[0.05] text-slate-500'
                }

                return (
                  <button key={oi} onClick={() => pick(qi, oi)} disabled={isShown}
                    className={`w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border
                                text-xs sm:text-sm text-left transition-all duration-150 ${cls}`}>
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center
                                      text-[10px] font-bold flex-shrink-0
                      ${isShown && isCorrect ? 'bg-emerald-500/25'
                        : isShown && isSelected ? 'bg-rose-500/25' : 'bg-white/[0.06]'}`}>
                      {KEYS[oi]}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {isShown && isCorrect && <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />}
                    {isShown && isSelected && !isCorrect && <XCircle size={14} className="text-rose-400 flex-shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {allAnswered && (
        <div className="mt-5 flex justify-end">
          <button onClick={() => setDone(true)} className="btn-gold flex items-center gap-2">
            <Trophy size={14} /> See Results
          </button>
        </div>
      )}
    </div>
  )
}
