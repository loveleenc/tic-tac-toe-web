import { Router } from "express";
import gameServices from '../utils/game.js'
import { v4 as uuidv4 } from 'uuid'
import getGames from "../data/liveData.js";
import middleware from "../utils/middleware.js";
const gameRouter = Router()


gameRouter.post('/', (request, response) => {
    const body = request.body
    const players = body.players

    if(!players){
        return response.status(400).json({error: 'players are missing'})
    }

    if(!request.body.width || !request.body.height){
        return response.status(400).json({error: 'height or width is missing'})
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
        const id = gameServices.playAsComputer(game)
        game.playerData = gameServices.updateMoveInPlayerData(game.playerData, id)
        gameServices.selectNextPlayer(game.playerData)
    }
    
    game.grid = gameServices.createGridArray(game)
    const gameId = uuidv4()
    getGames()[gameId] = game
    response.cookie('gameId', gameId)
    const newGame = {
        playerData: game.playerData,
        grid: game.grid,
        status: 'ONGOING',
        winner: null
    }
    return response.json(newGame)
})


const verifyAndUpdateGameState = (id, game) => {
    const updatedGame = {
    }
    game.playerData = gameServices.updateMoveInPlayerData(game.playerData, id)
    if(gameServices.hasCurrentPlayerHasWon(id, game)){
        updatedGame.status = 'END'
        updatedGame.winner = game.playerData.find(player => player.turn === true).symbol
    }
    else if (gameServices.nobodyWins(game)){
        updatedGame.status = 'END'
        updatedGame.winner = null
    }
    else{
        gameServices.selectNextPlayer(game.playerData)
        updatedGame.playerData = game.playerData
        updatedGame.grid = gameServices.createGridArray(game)
        updatedGame.status = 'ONGOING'
        updatedGame.winner = null
    }
    return updatedGame
}


gameRouter.patch('/', middleware.getGame, (request, response) => {
    const game = request.game
    if(request.body.id === undefined){
        return response.status(400).json({error: 'move id is missing in request'})
    }

    else if(isNaN(parseInt(request.body.id, 10))){
        return response.status(400).json({error: 'move id should be an integer that specifies the id of the cell which has been selected'})
    }

    else if(request.body.id > (game.width * game.height) - 1){
        return response.status(400).json({error: 'move id selected is out of range of the game board'})
    }

    let updatedGame = verifyAndUpdateGameState(request.body.id, game)
    if(game.playerData.find(p => p.turn === true && p.isComputer === true)){
        const id = gameServices.playAsComputer(game)
        updatedGame = verifyAndUpdateGameState(id, game)
    }
    return response.json(updatedGame)
})


gameRouter.delete('/', middleware.getGame, (request, response) => {
    delete request.game
    return response.status(204).end()
})


gameRouter.put('/', middleware.getGame, (request, response) => {
    const game = request.game
    game.playerData.forEach(player => player.moves = [])
    game.grid = gameServices.createGridArray(game)
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