import express from 'express'
import gameServices from './game.js'
import { v4 as uuidv4 } from 'uuid'
import cookieParser from 'cookie-parser'

const games = {}

const app = express()
app.use(express.json())
app.use(express.static('ui/dist'))
app.use(cookieParser())

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

    if(request.body.minMoves < 3 || request.body.minMoves > Math.max(request.body.width, request.body.height)){
        return response.status(400).json({error: 'min number of moves needed to win should be greater than or equal to 3 and less than or equal to the width/height (whichever is bigger)'})
    }

    const game = {}
    game.width = request.body.width
    game.height = request.body.height
    game.minMoves = request.body.minMoves
    if(request.body.disableSquares){
        game.squares = gameServices.selectSquaresToDisable(game.width, game.height)
    }
    else{
        game.squares = []
    }
    game.playerData = gameServices.createInitialPlayerData(players)
    if(game.playerData.find(p => p.turn === true && p.isComputer === true)){
        const id = gameServices.playAsComputer(game.playerData, game.squares, "easy", game.width, game.height)
        game.playerData = gameServices.updateMoveInPlayerData(game.playerData, id)
        gameServices.selectNextPlayer(game.playerData)
    }
    
    game.grid = gameServices.createGridArray(game.width, game.height, game.playerData, game.squares)
    const gameId = uuidv4()
    games[gameId] = game
    response.cookie('gameId', gameId)
    const newGame = {
        playerData: game.playerData,
        grid: game.grid,
        disabledSquares: game.squares,   //TODO: to be removed
        status: 'ONGOING',
        winner: null
    }
    return response.json(newGame)
})

const verifyAndUpdateGameState = (id, gameId) => {
    const game = games[gameId]
    const updatedGamee = {
        disabledSquares: game.squares    //TODO: to be removed
    }
    game.playerData = gameServices.updateMoveInPlayerData(game.playerData, id)
    if(gameServices.hasCurrentPlayerHasWon(id, game.minMoves, game.width, game.height, game.playerData)){
        updatedGamee.status = 'END'
        updatedGamee.winner = game.playerData.find(player => player.turn === true).symbol
    }
    else if (gameServices.nobodyWins(game.playerData, game.width, game.height, game.squares)){
        updatedGamee.status = 'END'
        updatedGamee.winner = null
    }
    else{
        gameServices.selectNextPlayer(game.playerData)
        updatedGamee.disabledSquares = game.squares
        updatedGamee.playerData = game.playerData
        updatedGamee.grid = gameServices.createGridArray(game.width, game.height, game.playerData, game.squares)
        updatedGamee.status = 'ONGOING'
        updatedGamee.winner = null
    }
    return updatedGamee
}


app.patch('/game', (request, response) => {
    const gameId = request.cookies.gameId
    const game = games[gameId]
    
    if(request.body.id === undefined){
        return response.status(400).json({error: 'move id is missing in request'})
    }

    else if(isNaN(parseInt(request.body.id, 10))){
        return response.status(400).json({error: 'move id should be an integer that specifies the id of the cell which has been selected'})
    }

    else if(request.body.id > (game.width * game.height) - 1){
        return response.status(400).json({error: 'move id selected is out of range of the game board'})
    }

    let updatedGame = verifyAndUpdateGameState(request.body.id, gameId)
    if(game.playerData.find(p => p.turn === true && p.isComputer === true)){
        const id = gameServices.playAsComputer(game.playerData, game.squares, "easy", game.width, game.height)
        updatedGame = verifyAndUpdateGameState(id, gameId)
    }
    return response.json(updatedGame)
})

app.delete('/game', (request, response) => {
    const gameId = request.cookies.gameId
    delete games[gameId]
    return response.status(204).end()
})


app.put('/game', (request, response) => {
    const gameId = request.cookies.gameId
    const game = games[gameId]
    game.playerData.forEach(player => player.moves = [])
    game.grid = gameServices.createGridArray(game.width, game.height, game.playerData, game.squares)
    const refreshGameg = {
        playerData: game.playerData,
        grid: game.grid,
        disableSquares: game.squares,
        status: 'ONGOING',
        winner: null
    }
    return response.json(refreshGameg)
})

const PORT = 3001 || process.env.PORT
app.listen(PORT, () => {console.log(`server running on port: ${PORT}`)})