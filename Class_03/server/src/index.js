import dotenv from "dotenv"
import { app } from "./app.js"
dotenv.config({
    path: '.env'
})

const startServer = () => {
    try {
        const PORT = process.env.PORT || 8000

        app.on("error", (error) => {
            console.error("Express App Error:", error);
            process.exit(1)
        })
        
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        })
    } catch (error) {
        console.error("Server Start Failed:", error)
        process.exit(1);
    }
}

startServer()