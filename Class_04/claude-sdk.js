import { Anthropic } from "@anthropic-ai/sdk";

const client = new Anthropic({
    apiKey: process.env["ANTHROPIC_API_KEY"] // This is the default and can be omitted
});

async function main() {
    await client.messages.create({
        max_tokens: 1024,
        model: "claude-opus-5",
        messages: [
            {
                role: "system",
                content: "Provide information about the requested movie."
            },
            {
                role: "user",
                content: "I want information about the movie Inception, Shutter Island and The Dark Knight."
            }
        ]
    })

    for (const block of message.content) {
        if (block.type === "text") {
            console.log(block.text);
        }
    }
}

main()