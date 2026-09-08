import dotenv from "dotenv";

dotenv.config();

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx"
import { OpenAIEmbeddings } from "@langchain/openai"
import { QdrantVectorStore } from "@langchain/qdrant"
 
async function indexing(filepath) {
    // 1. Load Document
    let documents;

    if (filepath.endsWith(".pdf")) {
        const loader = new PDFLoader(filepath);
        documents = await loader.load();
    }
    else if (filepath.endsWith(".docx")) {
        const loader = new DocxLoader(filepath);
        documents = await loader.load();
    }
    else {
        throw new Error("Unsupported file type");
    }


    // // 2. Split into chunks
    // const splitter = new RecursiveCharacterTextSplitter({
    //     chunkSize: 1000,
    //     chunkOverlap: 200,
    // });

    // const chunks = await splitter.splitDocuments(documents);

    // 3. Create embeddings
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
        apiKey: process.env.OPENAI_API_KEY,
    });

    // 4. Connect to existing Qdrant collection
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: "http://localhost:6333",
            collectionName: "rabiRag-test",
        }
    );

    // 5. Store chunks + embeddings
    await vectorStore.addDocuments(documents);

    console.log("Document indexed successfully!");
}

indexing('SD_Forge_Settings_Guide.docx')