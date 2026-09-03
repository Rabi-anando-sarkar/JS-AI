import "dotenv/config";

import OpenAI from "openai"
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Define how one single movie is structured
const MovieSchema = z.object({
    title: z.string(),
    genres: z.array(z.string()),
    rating: z.number().min(1).max(10),
    releaseDate: z.string().nullable(),
})

// Define how the output should be structured for multiple movies
const outputFormat = z.object({
    movies: z.array(MovieSchema)
})

// This function will call the OpenAI API to get information about the requested movies and parse the output according to the defined schema.
async function main() {
    const response = await client.responses.parse({
        model: "gpt-5-nano",
        input: [
            {
                role: "system",
                content: "Provide information about the requested movie."
            },
            {
                role: "user",
                content: "I want information about the movie Inception, Shutter Island and The Dark Knight."
            }
        ],
        text: {
            format: zodTextFormat(outputFormat, "movie_analysis")
        }
    })

    const result = response.output_parsed.movies;
    console.log("Parsed Output:", result);
}

main()