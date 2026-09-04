import express from 'express'
import cors from 'cors'
import { chatRouter } from './routes/chat.route.js';

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

app.use('/api/v1/chat', chatRouter)