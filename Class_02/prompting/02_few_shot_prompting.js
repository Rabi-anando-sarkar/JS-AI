import dotenv from "dotenv";
import { OpenAI } from "openai"

dotenv.config();

const examplePrompt = `Tell me about education in 400 characters.

Do not add anything else in answers, take the samples from the examples

Examples: 
-- Input Prompt: Tell me about gaming in 400 characters.
-- Output Prompt: What is Gaming?
Gaming means playing digital games on devices like computers, consoles, and mobile phones for entertainment, competition, or social interaction.

Why is the need of Gaming?
Gaming provides entertainment, relaxation, and can improve problem-solving, creativity, and teamwork skills.

Effect of Gaming on our daily life
Gaming can reduce stress and improve cognitive skills, but excessive gaming may affect sleep, studies/work, physical activity, and social life.

-- Input Prompt: Tell me about workout in 400 characters.
-- Output Prompt: What is Workout?
Workout is physical exercise performed to improve fitness, strength, flexibility, and overall health.

Why is the need of Workout?
Workout helps maintain a healthy body, build strength, improve stamina, reduce stress, and prevent many lifestyle-related health problems.

Effect of Workout on our daily life
Regular workouts improve energy, mood, sleep, concentration, and physical fitness, helping us stay active and productive in daily life.
`

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

// An Example of how few shot prompting works - Direct Instructions with examples
async function main() {
    const result = await client.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
            {
                role: 'user',
                content: examplePrompt
            }
        ]
    })
    console.log("Answer from OpenAi API :", result.choices[0].message.content);
}

main();