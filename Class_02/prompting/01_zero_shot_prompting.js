import dotenv from "dotenv";
import { OpenAI } from "openai"

dotenv.config();

// initialising openai key
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

// An Example of how zero shot prompting works - Direct Instructions
async function main() {
    const result = await client.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
            {
                role: 'user',
                content: "Tell me about prompting in 200 characters."
            }
        ]
    })
    console.log("Answer from OpenAi API :", result.choices[0].message.content);
}

main();