
import { useState, useRef } from 'react'
import { Upload, FileText, X, Loader2, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { parsePdf } from '../api'

export default function InputPanel({ onContent, onGenerate, hasContent }) {
  const [mode, setMode]       = useState('pdf')
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfMeta, setPdfMeta] = useState(null)
  const [text, setText]       = useState('')
  const [parsing, setParsing] = useState(false)
  const [drag, setDrag]       = useState(false)
  const fileRef               = useRef()

  const handleFile = (file) => {
    if (!file || file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5 MB.')
      return
    }
    setPdfFile(file); setPdfMeta(null); onContent('')
    toast.success(`"${file.name}" selected`)
  }

  const doParse = async () => {
    if (!pdfFile) return
    setParsing(true)
    const toastId = toast.loading('Parsing PDF…')
    try {
      const data = await parsePdf(pdfFile)
      setPdfMeta({ pages: data.pageCount, chars: data.text.length })
      onContent(data.text)
      toast.success(`Parsed! ${data.pageCount} pages · ${data.text.length.toLocaleString()} chars`, { id: toastId })
    } catch (e) {
      toast.error(e.message, { id: toastId })
    } finally {
      setParsing(false)
    }
  }

  const clearPdf = () => {
    setPdfFile(null); setPdfMeta(null); onContent('')
    if (fileRef.current) fileRef.current.value = ''
    toast('PDF cleared', { icon: '🗑️' })
  }

  const handleTextChange = (e) => {
    setText(e.target.value)
    onContent(e.target.value)
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <div className="card mb-5 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/[0.07] bg-white/[0.02]">
        {[
          { id: 'pdf',  label: '📄 Upload PDF' },
          { id: 'text', label: '✏️ Paste Text'  },
        ].map(t => (
          <button key={t.id} onClick={() => setMode(t.id)}
            className={`flex-1 py-3 sm:py-3.5 text-xs sm:text-sm font-medium transition-all duration-150
              ${mode === t.id
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-slate-500 hover:text-slate-300 border-b-2 border-transparent'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-5">
        {/* PDF MODE */}
        {mode === 'pdf' && (
          <div>
            {!pdfFile ? (
              <label
                onDragOver={e => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
                className={`flex flex-col items-center justify-center gap-3 p-8 sm:p-10
                            rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
                            ${drag ? 'border-amber-400 bg-amber-500/8' : 'border-white/[0.1] hover:border-white/20 hover:bg-white/[0.02]'}`}>
                <input ref={fileRef} type="file" accept="application/pdf" className="hidden"
                       onChange={e => handleFile(e.target.files[0])} />
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all
                                 ${drag ? 'bg-amber-500/20' : 'bg-white/[0.05]'}`}>
                  <Upload size={22} className={drag ? 'text-amber-400' : 'text-slate-400'} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-200 mb-1">Drop your PDF here</p>
                  <p className="text-xs text-slate-500">or click to browse — max 5 MB</p>
                </div>
              </label>
            ) : (
              <div>
                <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl
                                bg-white/[0.04] border border-white/[0.08] mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-500/15
                                    flex items-center justify-center flex-shrink-0">
                      <FileText size={16} className="text-rose-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-200 truncate">{pdfFile.name}</p>
                      <p className="text-xs text-slate-500">{(pdfFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button onClick={clearPdf}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500
                               hover:text-slate-200 hover:bg-white/[0.07] transition-all flex-shrink-0 ml-2">
                    <X size={15} />
                  </button>
                </div>

                {pdfMeta ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
                         style={{ boxShadow:'0 0 6px rgba(52,211,153,0.8)' }} />
                    <p className="text-xs text-emerald-300 font-medium">
                      Parsed — {pdfMeta.pages} pages · {pdfMeta.chars.toLocaleString()} chars
                    </p>
                  </div>
                ) : (
                  <button onClick={doParse} disabled={parsing} className="btn-gold flex items-center gap-2">
                    {parsing
                      ? <><Loader2 size={15} className="animate-spin" /> Parsing…</>
                      : <><FileText size={15} /> Parse PDF</>}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TEXT MODE */}
        {mode === 'text' && (
          <div>
            <textarea value={text} onChange={handleTextChange}
              placeholder="Paste your lecture notes, textbook content, or any study material here…"
              className="input-base resize-none leading-relaxed"
              style={{ minHeight: '160px' }} />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-600">
                {wordCount.toLocaleString()} words · {text.length.toLocaleString()} chars
              </p>
              {text.length > 0 && (
                <button onClick={() => { setText(''); onContent(''); toast('Text cleared', { icon: '🗑️' }) }}
                  className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Generate bar */}
      <div className="px-4 sm:px-5 py-3.5 border-t border-white/[0.06] bg-white/[0.01]
                      flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 mr-1">
          <Sparkles size={12} className="text-amber-400" />
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Generate:</span>
        </div>
        {[
          { key:'summary',    emoji:'📋', label:'Summary'    },
          { key:'flashcards', emoji:'🃏', label:'Flashcards' },
          { key:'quiz',       emoji:'🧩', label:'Quiz'       },
          { key:'chat',       emoji:'💬', label:'Chat'       },
        ].map(({ key, emoji, label }) => (
          <button key={key} onClick={() => onGenerate(key)} disabled={!hasContent}
            className="btn-ghost text-xs flex items-center gap-1.5 !px-3 !py-2">
            <span>{emoji}</span>
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.slice(0,4)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
