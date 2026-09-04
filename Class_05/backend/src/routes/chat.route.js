import { Router } from "express"
import { handleChatRequest } from "../controllers/chat.controllers.js"

export const chatRouter = Router()

chatRouter.route('/chats').post(handleChatRequest)