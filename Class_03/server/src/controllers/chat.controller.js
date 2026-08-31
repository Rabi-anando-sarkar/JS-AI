import { OpenAI } from "openai"
import { asyncHandler } from "../util/AsyncHandler.js"
import { ApiError } from "../util/ApiError.js"
import { SYSTEM_PROMPT_MARSHALL, SYSTEM_PROMPT_TED } from "../util/constants.js"
import { ApiResponse } from "../util/ApiResponse.js"

const client = new OpenAI({
    apikey: process.env.OPENAI_API_KEY
})

const MESSAGES_DB = {
    ted: [],
    marshall: []
}

export const chatMessages = asyncHandler(async (req,res) => {
    const {
        personaId,
        message
    } = req.body;

    if(
        [personaId,message].some((field) => !field || field.trim() === '')
    ) {
        throw new ApiError(
            400,
            'All feilds are required'
        )
    }

    let SYSTEM_PROMPT;

    if(personaId === "ted") {
        SYSTEM_PROMPT = SYSTEM_PROMPT_TED
    } else if (personaId === "marshall") {
        SYSTEM_PROMPT = SYSTEM_PROMPT_MARSHALL
    } else {
        throw new ApiError(
            400,
            "Invalid Persona"
        )
    }

    MESSAGES_DB[personaId].push({
        role: 'user',
        content: message
    })

    const result = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: SYSTEM_PROMPT
            },
            ...MESSAGES_DB[personaId]
        ]
    })

    const rawResult = result.choices[0].message.content

    // const parsedResult = JSON.parse(rawResult)

    MESSAGES_DB[personaId].push(
        {
            role: 'assistant',
            content: rawResult
        }
    )


    return res
    .status(200)
    .json(new ApiResponse(
        200,
        rawResult,
        personaId
    ))
})