import { PERSONAS } from '../personas'
import './PersonaRail.css'

export default function PersonaRail({ activeId, onSelect, threads }) {
  return (
    <nav className="rail">
      <div className="rail-header">
        <span className="rail-mark">MacLaren's</span>
        <span className="rail-sub">pick a booth</span>
      </div>

      <div className="rail-tabs">
        {Object.values(PERSONAS).map((p) => {
          const isActive = p.id === activeId
          const hasMessages = threads[p.id]?.messages.length > 0
          return (
            <button
              key={p.id}
              className={`rail-tab${isActive ? ' is-active' : ''}`}
              style={{ '--tab-accent': p.accent, '--tab-tint': p.tint }}
              onClick={() => onSelect(p.id)}
              aria-pressed={isActive}
            >
              <span className="rail-tab-avatar">{p.initial}</span>
              <span className="rail-tab-text">
                <span className="rail-tab-name">{p.name}</span>
                <span className="rail-tab-tagline">{p.tagline}</span>
              </span>
              {hasMessages && <span className="rail-tab-dot" aria-hidden="true" />}
            </button>
          )
        })}
      </div>

      <div className="rail-footer">
        <p>Legen — wait for it.</p>
      </div>
    </nav>
  )
}
