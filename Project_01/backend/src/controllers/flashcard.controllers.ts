import type { Request, Response } from "express";

import { askModel } from "../services/askModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const flashcards = asyncHandler(
    async (req: Request, res: Response) => {
        const { prompt } = req.body;

        if (!prompt || prompt.trim() === "") {
            throw new ApiError(
                400,
                "Prompt is required"
            );
        }

        console.log("Received prompt:", prompt);

        const result = await askModel(prompt);

        console.log("Generated flashcards:", result);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    result
                )
            );
    }
);