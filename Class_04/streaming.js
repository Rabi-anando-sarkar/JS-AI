import "dotenv/config";

import OpenAI from "openai"
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


async function main() {
    const stream = await client.responses.create({
        model: "gpt-5-nano",
        tools: [],
        input: [
            {
                role: "user",
                content: "tell me a story about a lonely robot who wants to make friends in 50 words"
            }
        ],
        stream: true,
    })

    for await (const event of stream) {
        if(event && event.delta) process.stdout.write(event.delta)
    }
    
}

main()