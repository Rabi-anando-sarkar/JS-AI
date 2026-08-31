const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export async function sendMessage(personaId, message) {
  const res = await fetch(`${API_BASE}/chat/chats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ personaId, message }),
  })

  let body
  try {
    body = await res.json()
  } catch {
    throw new Error('The server sent back something unreadable.')
  }

  if (!res.ok) {
    throw new Error(body?.message || `Request failed (${res.status})`)
  }

  // ApiResponse shape: { statusCode, data, message, success }
  return body.data
}
