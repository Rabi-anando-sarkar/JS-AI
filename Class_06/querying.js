import dotenv from "dotenv";

dotenv.config();

import { OpenAIEmbeddings } from "@langchain/openai"
import { QdrantVectorStore } from "@langchain/qdrant"
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

async function querying(userQuery) {
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
        apiKey: process.env.OPENAI_API_KEY,
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: "http://localhost:6333",
            collectionName: "rabiRag-test",
        }
    );

    const vectorRetriver = vectorStore.asRetriever({
        k: 5
    })

    const results = await vectorRetriver.invoke(userQuery)

    const SYSTEM_PROMPT = `
        You are an expert in answereing user query based on the provided context about document.
    If the answer is not present in the provided context, say:
"I couldn't find that information in the document."
Do not use your own knowledge.

    Always also answer the user in short and tell on which page number that content is available and also name of the book

    User Documents:
    ${results.map((e) => JSON.stringify({ bookName: e.metadata.source, pageContent: e.pageContent })).join('\n\n')}
    `

    const response = await client.responses.create({
        model: 'gpt-4o-mini',
        instructions: SYSTEM_PROMPT,
        input: userQuery,
    })

    console.log(response.output_text);
}

querying('tell me forge ui steps')