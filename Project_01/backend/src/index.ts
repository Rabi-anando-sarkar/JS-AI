import express, {type Request, type Response} from "express";
import cors from "cors";
import dotenv from 'dotenv'
import { log } from "console";
import { app } from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: "ok"
    })
})

app.listen(PORT, () => {
    log(`Server running on http://localhost:${PORT}`)
})