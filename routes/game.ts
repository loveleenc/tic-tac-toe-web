import { Router, Request,Response, NextFunction } from "express";
import middleware from "../utils/middleware";
import { Game, GameStatus, OutgoingGameData, Setup } from "../types/types";
import gameService from "../services/gameService";
import { v4 as uuidv4 } from 'uuid'
import getGames from "../data/liveData";
import { ExistingGameRequest } from "../types/express/request";
import parsers from "../utils/parsers";

const gameRouter = Router()

gameRouter.post('/', middleware.parseGameSetup, (request:Request<unknown,unknown,
    Setup, unknown>, response:Response<OutgoingGameData>) => {
    const game:Game = {
        width:request.body.width,
        height:request.body.height,
        minMoves: request.body.minMoves,
        squares: request.body.disableSquares ? gameService.selectSquaresToDisable(request.body.width, request.body.height) : [],
        playerData: [],
    }
    gameService.createAllPlayerData(request.body.players, game)
    
    const games = getGames()
    games[uuidv4()] = game
    const outgoingGameData:OutgoingGameData = {
        grid: gameService.createGridArray(game),
        playerData: game.playerData,
        status: GameStatus.ONGOING,
        winner: null,
    }
    response.json(outgoingGameData)
    return
})

gameRouter.patch('/', middleware.getGame, (request:ExistingGameRequest, response:Response, next:NextFunction) => {
    try{
        const game = request.game
        const id = parsers.parseId(request.body.id, game)
        const outgoingGameData = gameService.updateGameState(id, game)
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

gameRouter.delete('/', middleware.getGame, (request:ExistingGameRequest, response:Response) => {
    delete request.game
    response.status(204).end()
})

gameRouter.put('/', middleware.getGame, (request:ExistingGameRequest, response:Response<OutgoingGameData>) => {
    const game:Game = request.game
    const outgoingGameData:OutgoingGameData = gameService.restartGame(game)
    response.json(outgoingGameData)
})

export default gameRouter