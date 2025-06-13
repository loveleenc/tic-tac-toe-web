import express from 'express';
import cookieParser from 'cookie-parser'
import gameRouter from './routes/game';

const app = express()
app.use(express.json())
app.use(express.static('ui/dist'))
app.use(cookieParser())
app.use('/api/game', gameRouter)

const PORT = process.env.PORT ?? 3001

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})