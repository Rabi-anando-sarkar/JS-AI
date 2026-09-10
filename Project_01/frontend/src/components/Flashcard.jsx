import { useState } from "react";

const DIFFICULTY_LABEL = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export default function Flashcard({ question, answer, difficulty, index }) {
  const [flipped, setFlipped] = useState(false);

  function toggle() {
    setFlipped((f) => !f);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  }

  return (
    <div className="card-scene">
      <div
        className={`card difficulty-${difficulty}${flipped ? " flipped" : ""}`}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={flipped ? "Showing answer, click to show question" : "Showing question, click to reveal answer"}
      >
        <div className="card-face card-front">
          <span className={`tag tag-${difficulty}`}>
            {DIFFICULTY_LABEL[difficulty] || difficulty}
          </span>
          <p className="card-text">{question}</p>
          <span className="card-hint">Click to reveal</span>
          <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="card-face card-back">
          <span className={`tag tag-${difficulty}`}>Answer</span>
          <p className="card-text">{answer}</p>
          <span className="card-hint">Click to flip back</span>
          <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
}
