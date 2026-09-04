import { ApiError } from "../utils/ApiError.js";
import { runOrchestrator } from "../services/orchestrator.services.js";

export const handleChatRequest = async (req, res) => {
    try {
        const { userPrompt } = req.body;

        if (!userPrompt || typeof userPrompt !== "string") {
            throw new ApiError(400, "Invalid user prompt");
        }

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const result = await runOrchestrator(userPrompt, (chunk) => {
            res.write(`data: ${JSON.stringify({
                type: "chunk",
                content: chunk
            })}\n\n`);
        });

        res.write(`data: ${JSON.stringify({
            type: "done",
            candidates: result.candidates,
            usage: result.usage
        })}\n\n`);

        res.end();

    } catch (error) {
        console.error(error);

        if (!res.headersSent) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal server error"
            });
        } else {
            res.end();
        }
    }
};