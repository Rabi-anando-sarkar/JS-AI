import express from 'express'
import cors from 'cors'
import { flashRouter } from './routes/flashcards.routes.js';

export const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}));

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use('/api/v1/flash', flashRouter)