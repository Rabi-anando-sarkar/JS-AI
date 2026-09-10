# Deckbox

A small Vite + React frontend for your flashcard-generator backend. Type a
topic, get back a deck of cards showing only the question — click a card to
flip it and reveal the answer.

## Run it

```bash
npm i
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Before it'll work: point it at your backend

This app expects your Express server to be running separately and to expose
a `POST` endpoint that accepts `{ "prompt": "..." }` and returns your
flashcards. I don't have your routes file, so I guessed the two things that
could easily be wrong for your setup — both are one-line fixes:

**1. The endpoint URL.** Default assumed value:

```
http://localhost:8000/api/v1/flashcards
```

If your server runs on a different port or the route is mounted somewhere
else, copy `.env.example` to `.env` and change `VITE_API_URL`:

```bash
cp .env.example .env
# then edit .env
```

**2. The response shape.** The app reads `data.data.flashcards` first,
falling back to `data.flashcards` — that covers both a raw
`{ flashcards: [...] }` response and one wrapped in an `ApiResponse` like
`{ statusCode, data: { flashcards }, message, success }`. If your
`ApiResponse` class nests things differently, adjust the one line in
`src/App.jsx` inside `handleSubmit` (search for `flashcards ??`).

**3. CORS.** Since the frontend (port 5173) and backend (port 8000) run on
different origins, your Express app needs CORS enabled for requests from
the Vite dev server, e.g.:

```js
import cors from "cors";
app.use(cors({ origin: "http://localhost:5173" }));
```

If you already have this, ignore it.

## What's in here

- `src/App.jsx` — fetch call to your backend, loading/error/empty states
- `src/components/PromptForm.jsx` — the topic input and submit button
- `src/components/FlashcardGrid.jsx` / `Flashcard.jsx` — the deck and the
  flip-on-click card itself (works with click, Enter, or Space)

No extra libraries beyond React — no state management, no CSS framework —
so there's nothing else to install or configure.
