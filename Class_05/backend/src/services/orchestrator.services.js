import { JUDGE_MODEL, MODELS_SOL } from "../utils/constants.js";
import { askModel } from "./askModel.services.js";

export async function runOrchestrator(userPrompt, onChunk) {
    const [modelAResponse, modelBResponse, modelCResponse] = await Promise.all([
        askModel(MODELS_SOL.MODEL_A, userPrompt),
        askModel(MODELS_SOL.MODEL_B, userPrompt),
        askModel(MODELS_SOL.MODEL_C, userPrompt),
    ]);

    const judgePrompt = `
User Prompt: ${userPrompt}

Model A Response: ${modelAResponse.text}
Model B Response: ${modelBResponse.text}
Model C Response: ${modelCResponse.text}

Analyze all three outputs in relation to the original user question.
Select the two strongest outputs based on accuracy, relevance, completeness, and clarity.
Use those two outputs to create a single improved final answer.

Do not simply copy one output. Synthesize the useful information from both selected outputs into the best possible response to the user's question.

Return only the final answer.
`;

    const judgeStream = await askModel(
        JUDGE_MODEL,
        judgePrompt,
        true
    );

    let finalAnswer = "";
    let judgeUsage = null;

    for await (const event of judgeStream) {
        if (event.type === "response.output_text.delta") {
            finalAnswer += event.delta;
            onChunk(event.delta);
        }

        if (event.type === "response.completed") {
            judgeUsage = event.response.usage;
        }
    }

    return {
        answer: finalAnswer,

        candidates: [
            MODELS_SOL.MODEL_A,
            MODELS_SOL.MODEL_B,
            MODELS_SOL.MODEL_C
        ],

        usage: {
            MODEL_A: modelAResponse.usage,
            MODEL_B: modelBResponse.usage,
            MODEL_C: modelCResponse.usage,
            JUDGE_MODEL: judgeUsage
        }
    };
}