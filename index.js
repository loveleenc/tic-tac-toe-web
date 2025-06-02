import express from 'express'
import gameServices from './game.js'

let playerData = []
let maxCount = 0;
let width = 0;
let height = 0;
let minMoves = 0;
let squares = []

const app = express()
app.use(express.json())
app.use(express.static('ui/dist'))

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
    minMoves = request.body.minMoves
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
        disabledSquares: squares,   //TODO: to be removed
        status: 'ONGOING',
        winner: null
    }
    return response.json(newGame)
})

const verifyAndUpdateGameState = (id) => {
    const updatedGame = {
        disabledSquares: squares    //TODO: to be removed
    }
    playerData = gameServices.updateMoveInPlayerData(playerData, id)
    if(gameServices.hasCurrentPlayerHasWon(id, minMoves, width, height, playerData)){
        updatedGame.status = 'END'
        updatedGame.winner = playerData.find(player => player.turn === true).symbol
    }

    else if (gameServices.nobodyWins(playerData, width, height, squares)){
        updatedGame.status = 'END'
        updatedGame.winner = null
    }

    else{
        gameServices.selectNextPlayer(playerData)
        updatedGame.disabledSquares = squares
        updatedGame.playerData = playerData
        updatedGame.grid = gameServices.createGridArray(width, height, playerData, squares)
        updatedGame.status = 'ONGOING'
        updatedGame.winner = null
    }
    return updatedGame
}


app.patch('/game', (request, response) => {
    if(request.body.id === undefined){
        return response.status(400).json({error: 'move id is missing in request'})
    }

    else if(isNaN(parseInt(request.body.id, 10))){
        return response.status(400).json({error: 'move id should be an integer that specifies the id of the cell which has been selected'})
    }

    else if(request.body.id > (width * height) - 1){
        return response.status(400).json({error: 'move id selected is out of range of the game board'})
    }

    let updatedGame = verifyAndUpdateGameState(request.body.id)
    if(playerData.find(p => p.turn === true && p.isComputer === true)){
        const id = gameServices.playAsComputer(playerData, squares, "easy", width, height)
        updatedGame = verifyAndUpdateGameState(id)
    }
    return response.json(updatedGame)

})

app.delete('/game', (request, response) => {
    playerData = []
    width = 0
    height = 0
    squares = []
    return response.status(204).end()
})


app.put('/game', (request, response) => {
    playerData.forEach(player => player.moves = [])
    const grid = gameServices.createGridArray(width, height, playerData, squares)
    const refreshGame = {
        playerData: playerData,
        grid: grid,
        disableSquares: squares,
        status: 'ONGOING',
        winner: null
    }
    return response.json(refreshGame)
})

const PORT = 3001
app.listen(PORT, () => {console.log(`server running on port: ${PORT}`)})