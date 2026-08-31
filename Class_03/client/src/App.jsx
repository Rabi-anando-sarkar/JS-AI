import { useState } from 'react'
import { PERSONAS } from './personas'
import PersonaRail from './components/PersonaRail'
import ChatPanel from './components/ChatPanel'
import './App.css'

export default function App() {
  const [activeId, setActiveId] = useState('ted')

  // Each persona keeps its own message history + status, independent of the other tab.
  const [threads, setThreads] = useState({
    ted: { messages: [], status: 'idle', error: null },
    marshall: { messages: [], status: 'idle', error: null },
  })

  function updateThread(personaId, updater) {
    setThreads((prev) => ({
      ...prev,
      [personaId]: updater(prev[personaId]),
    }))
  }

  const active = PERSONAS[activeId]

  return (
    <div className="app" style={{ '--active-accent': active.accent, '--active-tint': active.tint }}>
      <div className="grain" />
      <PersonaRail activeId={activeId} onSelect={setActiveId} threads={threads} />
      <ChatPanel
        key={activeId}
        persona={active}
        thread={threads[activeId]}
        updateThread={(fn) => updateThread(activeId, fn)}
      />
    </div>
  )
}
