import { useEffect, useRef, useState } from 'react'
import { sendMessage } from '../api'
import MessageBubble from './MessageBubble'
import './ChatPanel.css'

export default function ChatPanel({ persona, thread, updateThread }) {
  const [draft, setDraft] = useState('')
  const listRef = useRef(null)
  const textareaRef = useRef(null)

  const isSending = thread.status === 'sending'

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [thread.messages, isSending])

  useEffect(() => {
    textareaRef.current?.focus()
  }, [persona.id])

  async function handleSend() {
    const text = draft.trim()
    if (!text || isSending) return

    setDraft('')
    updateThread((t) => ({
      ...t,
      status: 'sending',
      error: null,
      messages: [...t.messages, { role: 'user', content: text, id: crypto.randomUUID() }],
    }))

    try {
      const reply = await sendMessage(persona.id, text)
      updateThread((t) => ({
        ...t,
        status: 'idle',
        messages: [...t.messages, { role: 'assistant', content: reply, id: crypto.randomUUID() }],
      }))
    } catch (err) {
      updateThread((t) => ({
        ...t,
        status: 'error',
        error: err.message || 'Something went wrong sending that.',
      }))
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <section className="chat-panel">
      <header className="chat-header">
        <span className="chat-header-avatar" style={{ background: persona.accent }}>
          {persona.initial}
        </span>
        <div>
          <h1>{persona.fullName}</h1>
          <p>{persona.tagline}</p>
        </div>
      </header>

      <div className="chat-scroll" ref={listRef}>
        {thread.messages.length === 0 ? (
          <div className="chat-empty">
            <h2>{persona.emptyTitle}</h2>
            <p>{persona.emptyBody}</p>
          </div>
        ) : (
          <div className="chat-list">
            {thread.messages.map((m) => (
              <MessageBubble key={m.id} message={m} persona={persona} />
            ))}
            {isSending && (
              <div className="typing-row">
                <span className="typing-avatar" style={{ background: persona.accent }}>
                  {persona.initial}
                </span>
                <span className="typing-dots" aria-label={`${persona.name} is typing`}>
                  <i /><i /><i />
                </span>
              </div>
            )}
          </div>
        )}

        {thread.error && (
          <div className="chat-error" role="alert">
            {thread.error}
          </div>
        )}
      </div>

      <form
        className="chat-input-bar"
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={draft}
          placeholder={persona.placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" disabled={!draft.trim() || isSending}>
          Send
        </button>
      </form>
    </section>
  )
}
