import { useState } from "react";
import PromptForm from "./components/PromptForm.jsx";
import FlashcardGrid from "./components/FlashcardGrid.jsx";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/flash/cards";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSubmit() {
    setIsLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          json?.message || `Request failed with status ${res.status}`;
        throw new Error(message);
      }

      const flashcards = json?.data?.flashcards ?? json?.flashcards ?? [];

      if (!Array.isArray(flashcards) || flashcards.length === 0) {
        throw new Error("No flashcards came back for that topic. Try rephrasing it.");
      }

      setCards(flashcards);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong talking to the server."
      );
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="wordmark">Deckbox</h1>
        <p className="tagline">Name a topic. Get a deck of study cards.</p>
      </header>

      <PromptForm
        prompt={prompt}
        onPromptChange={setPrompt}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <main className="content">
        {error && <div className="error-box">{error}</div>}

        {!hasSearched && !error && (
          <p className="empty-state">
            Enter a topic above and your first deck will show up here.
          </p>
        )}

        {isLoading && <p className="loading-state">Building your deck…</p>}

        {!isLoading && <FlashcardGrid cards={cards} />}
      </main>
    </div>
  );
}
