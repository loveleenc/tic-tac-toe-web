import express from 'express';
import cookieParser from 'cookie-parser'
import gameRouter from './routes/game';
import loginRouter from './routes/login';
import config from './utils/config';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import middleware from './utils/middleware';
import logoutRouter from './routes/logout';
import accountRouter from './routes/account';

const app = express()

const url = config.MONGODB_URI
mongoose.connect(url)
    .then(() => {
        console.log('connected to mongoDB')
    })
    .catch(error => 
        console.log('error connecting to mongoDB', error.message)
    )

app.use(cookieParser())
app.use(middleware.extractToken)
app.use(express.json())
app.use(express.static('ui/dist'))
app.use('/api/login', loginRouter)
app.use('/users', userRouter)
app.use('/api/game', gameRouter)
app.use('/logout', logoutRouter)
app.use('/account', accountRouter)

app.use(middleware.errorHandler)

const PORT = process.env.PORT ?? 3001

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})