import { NextFunction, Request, Response } from "express";
import parsers from "./parsers";
import getGames from "../data/liveData";
import { ExistingGameRequest } from "../types/express/request";

const parseGameSetup = (request:Request, response:Response, next:NextFunction) => {
    try{
        parsers.isGameSetupData(request.body)
        if(request.body.width < 3 || request.body.height < 3){
            throw new Error('both width and height of the grid should be greater than or equal to 3')
        }
        if(request.body.minMoves < 3 || request.body.minMoves > Math.max(request.body.width, request.body.height)){
            throw new Error('min number of moves needed to win should be greater than or equal to 3 and less than or equal to the width/height (whichever is bigger)')
        }
        next()
    }
    catch(error: unknown){
        let errorMessage = 'something went wrong. '
        if(error instanceof Error){
            errorMessage += error.message
        }
        response.status(400).json({error: errorMessage})
        next(error)
    }
}

const getGame = (request:ExistingGameRequest, response:Response, next:NextFunction) => {
    const games = getGames()
    const gameId = request.cookies.gameId
    try{
        request.game = games[gameId]
        next()
    }
    catch(error){
        response.json(`Game with id ${gameId} does not exist`)
        next(error)
    }
}

export default {
    parseGameSetup,
    getGame
}