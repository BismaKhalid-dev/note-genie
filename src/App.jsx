import { useState } from 'react'
import { Menu, Sparkles } from 'lucide-react'
import Sidebar from './components/Sidebar'
import InputPanel from './components/InputPanel'
import SummaryView from './components/SummaryView'
import FlashcardsView from './components/FlashcardsView'
import QuizView from './components/QuizView'
import ChatView from './components/ChatView'
import { summarize, generateFlashcards, generateQuiz } from './api'

const TAB_TITLES = {
  summary:    { emoji: '📋', label: 'Summary' },
  flashcards: { emoji: '🃏', label: 'Flashcards' },
  quiz:       { emoji: '🧩', label: 'Quiz' },
  chat:       { emoji: '💬', label: 'Chat' },
}

export default function App() {
  const [tab, setTab]         = useState('summary')
  const [content, setContent] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [summaryData, setSummaryData] = useState(null)
  const [summaryLoad, setSummaryLoad] = useState(false)
  const [summaryErr,  setSummaryErr]  = useState('')

  const [flashData, setFlashData] = useState(null)
  const [flashLoad, setFlashLoad] = useState(false)
  const [flashErr,  setFlashErr]  = useState('')

  const [quizData, setQuizData] = useState(null)
  const [quizLoad, setQuizLoad] = useState(false)
  const [quizErr,  setQuizErr]  = useState('')

  const handleContent = (text) => {
    setContent(text)
    if (text !== content) {
      setSummaryData(null); setSummaryErr('')
      setFlashData(null);   setFlashErr('')
      setQuizData(null);    setQuizErr('')
    }
  }

  const handleGenerate = async (type) => {
    setTab(type)
    if (type === 'chat') return

    if (type === 'summary') {
      setSummaryLoad(true); setSummaryErr('')
      try { setSummaryData(await summarize(content)) }
      catch (e) { setSummaryErr(e.message) }
      finally { setSummaryLoad(false) }
    }
    if (type === 'flashcards') {
      setFlashLoad(true); setFlashErr('')
      try { setFlashData(await generateFlashcards(content)) }
      catch (e) { setFlashErr(e.message) }
      finally { setFlashLoad(false) }
    }
    if (type === 'quiz') {
      setQuizLoad(true); setQuizErr('')
      try { setQuizData(await generateQuiz(content)) }
      catch (e) { setQuizErr(e.message) }
      finally { setQuizLoad(false) }
    }
  }

  const { emoji, label } = TAB_TITLES[tab]
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  return (
    <div className="flex min-h-screen font-body">
      <Sidebar
        active={tab}
        onChange={setTab}
        hasContent={!!content.trim()}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main — offset for sidebar on lg+ */}
      <main className="flex-1 flex flex-col min-h-screen lg:ml-[260px]">

        {/* Topbar */}
        <header className="sticky top-0 z-40 px-4 sm:px-6 py-3.5 border-b border-white/[0.06]
                            bg-[#0b1120]/90 backdrop-blur-xl
                            flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Hamburger - mobile/tablet only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center
                         text-slate-400 hover:text-slate-100 hover:bg-white/[0.07]
                         rounded-xl transition-all"
            >
              <Menu size={20} />
            </button>
            <span className="text-xl">{emoji}</span>
            <h1 className="font-display text-base sm:text-lg font-semibold text-white tracking-tight">
              {label}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-500
                ${content.trim() ? 'bg-emerald-400' : 'bg-slate-700'}`}
              style={content.trim() ? { boxShadow: '0 0 8px rgba(52,211,153,0.7)' } : {}}
            />
            <span className="text-xs text-slate-500 hidden sm:block">
              {content.trim()
                ? `${wordCount.toLocaleString()} words loaded`
                : 'No notes loaded'}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 lg:p-7 w-full max-w-4xl mx-auto lg:mx-0">
          <InputPanel
            onContent={handleContent}
            onGenerate={handleGenerate}
            hasContent={!!content.trim()}
          />

          {tab === 'summary' && (
            <SummaryView data={summaryData} loading={summaryLoad} error={summaryErr} />
          )}
          {tab === 'flashcards' && (
            <FlashcardsView data={flashData} loading={flashLoad} error={flashErr} />
          )}
          {tab === 'quiz' && (
            <QuizView data={quizData} loading={quizLoad} error={quizErr} />
          )}
          {tab === 'chat' && (
            <ChatView content={content} />
          )}
        </div>
      </main>
    </div>
  )
}
