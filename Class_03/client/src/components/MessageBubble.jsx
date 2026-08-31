export default function MessageBubble({ message, persona }) {
  const isUser = message.role === 'user'

  return (
    <div className={`msg-row${isUser ? ' is-user' : ''}`}>
      {!isUser && (
        <span className="msg-avatar" style={{ background: persona.accent }}>
          {persona.initial}
        </span>
      )}
      <div
        className="msg-bubble"
        style={!isUser ? { borderLeftColor: persona.accent } : undefined}
      >
        <p>{message.content}</p>
      </div>
    </div>
  )
}
