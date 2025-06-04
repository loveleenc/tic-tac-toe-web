import express from 'express'
import cookieParser from 'cookie-parser'
import gameRouter from './controllers/game.js'

const app = express()
app.use(express.json())
app.use(express.static('ui/dist'))
app.use(cookieParser())
app.use('/api/game', gameRouter)

export default app