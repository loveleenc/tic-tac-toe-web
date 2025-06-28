import { Router, Response, NextFunction } from "express";
import middleware from "../utils/middleware";
import { Game, GameStatus, OutgoingGameData } from "../types/types";
import gameService from "../services/gameService";
import { v4 as uuidv4 } from 'uuid'
import getGames from "../data/liveData";
import { ExistingGameRequest, LoggedInUserRequest } from "../types/express/request";
import parsers from "../utils/parsers";

const gameRouter = Router()

gameRouter.post('/', [middleware.extractUser, middleware.parseGameSetup], async (request:LoggedInUserRequest, response:Response<OutgoingGameData>) => {
    const game:Game = {
        width:request.body.width,
        height:request.body.height,
        minMoves: request.body.minMoves,
        squares: request.body.disableSquares ? gameService.selectSquaresToDisable(request.body.width, request.body.height) : [],
        playerData: [],
    }
    const filteredPlayers = gameService.createAllPlayerData(request.body.players, request.user.username, game)
    
    const games = getGames()
    const gameId = uuidv4()
    games[gameId] = game
    response.cookie('gameId', gameId)
    const outgoingGameData:OutgoingGameData = {
        grid: gameService.createGridArray(game),
        playerData: filteredPlayers,
        status: GameStatus.ONGOING,
        winner: null,
    }
    response.json(outgoingGameData)
    return
})

gameRouter.patch('/', [middleware.extractUser, middleware.getGame], async (request:ExistingGameRequest, response:Response, next:NextFunction) => {
    try{
        const game = request.game
        if(!gameService.currentPlayerHasSentTheRequest(request.user, game)){
            response.status(400).json({error: 'only the current player can play the game'})
            return
        }
        const id = parsers.parseId(request.body.id, game)
        const outgoingGameData = await gameService.updateGameState(id, game)
        if(outgoingGameData.status === GameStatus.END){
            delete getGames()[request.cookies.gameId]
        }
        response.json(outgoingGameData)
        next()
    }
    catch(error: unknown){
        let errorMessage = 'something went wrong. '
        if (error instanceof Error){
            errorMessage += error.message
        }
        response.status(400).json({error: errorMessage})
        next(error)
    }
})

gameRouter.delete('/', [middleware.extractUser, middleware.getGame], async (request:ExistingGameRequest, response:Response) => {
    delete getGames()[request.cookies.gameId]
    response.status(204).end()
})

gameRouter.put('/', [middleware.extractUser, middleware.getGame], async (request:ExistingGameRequest, response:Response<OutgoingGameData>) => {
    const game:Game = request.game
    const outgoingGameData:OutgoingGameData = gameService.restartGame(game)
    response.json(outgoingGameData)
})

export default gameRouter