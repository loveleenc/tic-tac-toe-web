import express from 'express'
import gameServices from './src/services/game.js'
import cors from 'cors'

let playerData = []
let maxCount = 0;
let width = 0;
let height = 0;
let squares = []

const app = express()
app.use(express.json())
app.use(cors())

app.post('/game', (request, response) => {
    const body = request.body
    const players = body.players

    if(!players){
        return response.status(400).json({error: 'players are missing'})
    }

    if(!request.body.width || !request.body.height){
        return response.status(400).json({error: 'height or width is missing or less than 3'})
    }

    if (isNaN(parseInt(request.body.width, 10)) || isNaN(parseInt(request.body.height, 10)) ||
        isNaN(parseInt(request.body.minMoves, 10))){
        return response.status(400).json({error: 'width, height, and number of moves needed to win should be integers'})
    }

    if(request.body.width < 3 || request.body.height < 3){
        return response.status(400).json({error: 'both width and height of the grid should be greater than or equal to 3'})
    }

    if(request.body.minMoves < 3 || request.body.minMoves < Math.max(width, height)){
        return response.status(400).json({error: 'min number of moves needed to win should be greater than or equal to 3 and less than or equal to the width/height (whichever is bigger)'})
    }

    width = request.body.width
    height = request.body.height
    maxCount = width * height
    if(request.body.disableSquares){
        squares = gameServices.selectSquaresToDisable(width, height)
    }

    playerData = gameServices.createInitialPlayerData(players)
    if(playerData.find(p => p.turn === true && p.isComputer === true)){
        const id = gameServices.playAsComputer(playerData, squares, "easy", width, height)
        playerData = gameServices.updateMoveInPlayerData(playerData, id)
        gameServices.selectNextPlayer(playerData)
    }

    const grid = gameServices.createGridArray(width, height, playerData, squares)

    const newGame = {
        playerData: playerData,
        grid: grid,
        disabledSquares: squares   //TODO: to be removed
    }
    return response.json(newGame)
})

app.patch('/game', (request, response) => {
    
})

app.delete('/game', (request, response) => {

})



const PORT = 3001
app.listen(PORT, () => {console.log(`server running on port: ${PORT}`)})