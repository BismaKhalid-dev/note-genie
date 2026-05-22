const BASE = 'https://notegenie-backend.vercel.app'

export async function parsePdf(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/api/parse-pdf`, { method: 'POST', body: form })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to parse PDF')
  return data // { text, pageCount }
}

export async function summarize(content) {
  const res = await fetch(`${BASE}/api/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to summarize')
  return data // { overview, keyPoints, terms }
}

export async function generateFlashcards(content) {
  const res = await fetch(`${BASE}/api/flashcards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to generate flashcards')
  return data // { cards: [{ question, answer }] }
}

export async function generateQuiz(content) {
  const res = await fetch(`${BASE}/api/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to generate quiz')
  return data // { questions: [{ id, question, options, correctIndex }] }
}

export async function chat(content, history, message) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, history, message }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Chat failed')
  return data // { reply }
}
