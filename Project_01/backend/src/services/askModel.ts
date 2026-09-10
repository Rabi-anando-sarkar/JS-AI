import "dotenv/config";
import OpenAI from 'openai'
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
// import { SYSTEM_PROMPT } from '../utils/constants.js';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `
You are a flashcard generator for a learning application.

Your task is to read the user's learning request, identify the main subject they want to learn, and generate concise, useful flashcards about that subject.

FLASHCARD REQUIREMENTS:
- Generate between 2 and 8 flashcards.
- Each flashcard must contain:
  - difficulty: "easy", "medium", or "hard"
  - question: a clear question about the subject
  - answer: a concise and accurate answer
- Questions must be 120 characters or fewer.
- Answers must be 80 characters or fewer.
- Do not use markdown, bullet points, or line breaks inside questions or answers.
- Use simple, direct language.
- Avoid unnecessary details, repetition, and overly complex wording.

DIFFICULTY:
- Easy: basic definitions, concepts, or facts.
- Medium: understanding relationships, processes, or applications.
- Hard: deeper reasoning, comparison, or more advanced understanding.
- Distribute difficulty progressively when possible.

QUALITY RULES:
- Every question must test something meaningful about the subject.
- Every answer must directly answer its question.
- Do not create duplicate or nearly identical questions.
- Do not invent facts.
- If the user's request contains multiple subjects, focus on the primary subject.
- If the request is unclear, infer the most likely subject from the user's message.

LENGTH RULE:
If a question or answer exceeds its character limit, rewrite it to be shorter while preserving its meaning. Never omit the field because of the length limit.

Generate no more than 8 flashcards.
`;

const FlashcardSchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard"]),
  question: z.string().min(1).max(120, "Question must be 120 characters or fewer"),
  answer: z.string().min(1).max(80, "Answer must be 80 characters or fewer"),
});

const OutputSchema = z.object({
  flashcards: z.array(FlashcardSchema)
    .min(2, "Must generate at least 2 flashcards")
    .max(8, "Must generate no more than 8 flashcards"),
});

// type Flashcard = z.infer<typeof FlashcardSchema>;
type Output = z.infer<typeof OutputSchema>

export async function askModel(inputPrompt: string): Promise<Output> {
    const response = await client.responses.parse({
        model: 'gpt-5-nano',
        instructions: SYSTEM_PROMPT,
        input: inputPrompt,
        text: {
            format: zodTextFormat(OutputSchema, 'flashcards'),
        }
    })

    const parsed = response.output_parsed;

    if (!parsed) {
        throw new Error("Model response did not match the expected schema");
    }

    const result = OutputSchema.safeParse(parsed);

    if (!result.success) {
        console.error("Schema validation failed");
        throw new Error("Model output violated length constraints");
    }

    return result.data;
}