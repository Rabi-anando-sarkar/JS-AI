import dotenv from "dotenv";
import { OpenAI } from 'openai'

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

// Hello World in AI Inference Layer using API CALL 
client.chat.completions.create({
    model: 'gpt-5-nano',
    messages: [
        {
            role: 'user',
            content: "Hello, How are you?"
        }
    ],
    reasoning_effort: 'minimal'
}).then(response => {
    console.log(response.choices[0].message.content);
})