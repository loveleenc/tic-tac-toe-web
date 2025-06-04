import { Router } from "express";
import gameServices from '../utils/game.js'
import { v4 as uuidv4 } from 'uuid'

const gameRouter = Router()
const games = {}

gameRouter.post('/', (request, response) => {
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
    const updatedGame = {
        disabledSquares: game.squares    //TODO: to be removed
    }
    game.playerData = gameServices.updateMoveInPlayerData(game.playerData, id)
    if(gameServices.hasCurrentPlayerHasWon(id, game.minMoves, game.width, game.height, game.playerData)){
        updatedGame.status = 'END'
        updatedGame.winner = game.playerData.find(player => player.turn === true).symbol
    }
    else if (gameServices.nobodyWins(game.playerData, game.width, game.height, game.squares)){
        updatedGame.status = 'END'
        updatedGame.winner = null
    }
    else{
        gameServices.selectNextPlayer(game.playerData)
        updatedGame.disabledSquares = game.squares
        updatedGame.playerData = game.playerData
        updatedGame.grid = gameServices.createGridArray(game.width, game.height, game.playerData, game.squares)
        updatedGame.status = 'ONGOING'
        updatedGame.winner = null
    }
    return updatedGame
}


gameRouter.patch('/', (request, response) => {
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


gameRouter.delete('/', (request, response) => {
    const gameId = request.cookies.gameId
    delete games[gameId]
    return response.status(204).end()
})


gameRouter.put('/', (request, response) => {
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


export default gameRouter