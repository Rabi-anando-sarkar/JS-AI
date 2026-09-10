import { Router } from "express"
import { flashcards } from "../controllers/flashcard.controllers.js"

export const flashRouter = Router()

flashRouter.route('/cards').post(flashcards)