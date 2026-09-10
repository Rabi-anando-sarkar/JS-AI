import "dotenv/config";
import { askModel } from '../services/askModel.js' // adjust path to wherever askModel lives

async function main() {
//   const model = "gpt-4o-mini"; // swap for whatever model you're using
  const topic = "i wnant to learn about sdlc";

  console.log(`\nAsking model for flashcards on: "${topic}"...\n`);

  try {
    const result = await askModel(topic);

    console.log(`✅ Got ${result.flashcards.length} flashcards:\n`);

    result.flashcards.forEach((card, i) => {
      console.log(`--- Card ${i + 1} ---`);
      console.log(`Difficulty: ${card.difficulty}`);
      console.log(`Question:   ${card.question} (${card.question.length} chars)`);
      console.log(`Answer:     ${card.answer} (${card.answer.length} chars)`);
      console.log();
    });
  } catch (err) {
    console.error("❌ Test failed:\n", err);
  }
}

main();