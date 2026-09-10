import Flashcard from "./Flashcard.jsx";

export default function FlashcardGrid({ cards }) {
  if (!cards || cards.length === 0) return null;

  return (
    <div className="card-grid">
      {cards.map((card, i) => (
        <Flashcard
          key={i}
          index={i}
          question={card.question}
          answer={card.answer}
          difficulty={card.difficulty}
        />
      ))}
    </div>
  );
}
