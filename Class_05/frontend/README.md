# orchestrator-ui

Minimal Vite + React front end for your `handleChatRequest` SSE endpoint.

## Setup

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`.

## Wiring to your backend

- `vite.config.js` proxies `/api/*` to `http://localhost:8000`. Change the
  `target` there if your Express server listens on a different port.
- `src/App.jsx` posts `{ userPrompt }` to `/api/chat` and reads the response
  body as a stream, parsing the `data: {...}` SSE lines your controller
  writes (`type: "chunk"` for text, `type: "done"` for candidates + usage).
- Make sure whatever route you mount `handleChatRequest` on matches
  `/api/chat`, or update `ENDPOINT` in `App.jsx`.

## What it does

- Textarea + send button (Enter submits, Shift+Enter for a newline).
- Streams the judge's merged answer into the panel character-by-chunk as it
  arrives, with a blinking cursor while streaming.
- Once the `done` event lands, shows which models (`candidates`) took part.
