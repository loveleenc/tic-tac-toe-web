import express from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import gameRouter from './routes/game';

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use('/api/game', gameRouter)

const PORT = process.env.PORT ?? 3001

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})