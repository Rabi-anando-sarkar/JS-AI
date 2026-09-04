import OpenAI from "openai";

const client = new OpenAI({
    apikey: process.env.OPENAI_API_KEY,
})

export async function askModel(model,prompt,stream=false) {
    const response = await client.responses.create({
        model,
        input: prompt,
        stream,
    })

    if (stream) {
        return response;
    }

    return {
        text: response.output_text,
        usage: response.usage
    }
}
