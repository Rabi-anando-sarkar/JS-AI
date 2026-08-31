import { Router } from "express"
import { chatMessages } from "../controllers/chat.controller.js"

export const chatRouter = Router()

chatRouter.route('/chats').post(chatMessages)