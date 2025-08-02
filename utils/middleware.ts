import { NextFunction, Request, Response } from "express";
import parsers from "./parsers";
import { getGameWithId } from "../data/liveData";
import { ExistingGameRequest, LoggedInUserRequest } from "../types/express/request";
import jwt, { JwtPayload } from 'jsonwebtoken'
import errors from "./errors";
import { database } from "../services/databaseService";

const extractToken = (request:LoggedInUserRequest, _response:Response, next:NextFunction) => {
    if(request.cookies.token !== undefined){
        request.token = request.cookies.token
    }
    next()
}

const extractUser = async (request:LoggedInUserRequest, _response:Response, next:NextFunction) => {
    if(typeof process.env.SECRET === 'string'){
    const decodedToken = jwt.verify(request.token, process.env.SECRET) as JwtPayload
    if(decodedToken?.id){
        request.user = await database().getUserById(decodedToken.id);
        }
    }
    next()
}

const parseEmail = async (request:Request, response:Response, next:NextFunction) => {
    try{
        if(!request.body.email){
            response.status(400).json({error: 'email not available'});
            return;
        }
        parsers.parseEmail(request.body.email);
        next()
    }
    catch(error: unknown){
        let errorMessage = 'something went wrong with the entered email. E-mail does not seem to be correct'
        if(error instanceof Error){
            errorMessage += error.message
        }
        response.status(400).json({error: errorMessage})
        next(error)
    }
}

const parseNewAccount = async(request:Request, response:Response, next:NextFunction) => {
    try{
        parsers.isNewAccountData(request.body);
        next()
    }
    catch(error:unknown){
        let errorMessage = 'something went wrong with the new account details. '
        if(error instanceof Error){
            errorMessage += error.message
        }
        response.status(400).json({error: errorMessage})
        next(error)
    }
}

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
    const gameId = request.cookies.gameId
    request.game = getGameWithId(gameId);
    
    try{
        if(request.game === undefined){
            throw new Error(`Game with id ${gameId} does not exist`)
        }
        next()
    }
    catch(error){
        response.json(`Game not found`)
        next(error)
    }
}


const errorHandler = (error:unknown, _request: ExistingGameRequest | LoggedInUserRequest, response:Response, next:NextFunction) => {
    if(error instanceof Error){
        if (error.name === 'JsonWebTokenError'){
            response.status(401).json({error: 'token invalid'});
            return;
        }
        else if (error.name === 'TokenExpiredError'){
            response.status(401).json({error: 'token expired'});
            return;
        }
        else if(error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')){
            if("errorResponse" in error && 
                error.errorResponse instanceof Object && 
                "keyPattern" in error.errorResponse && 
                error.errorResponse.keyPattern instanceof Object){
                    if(Object.keys(error.errorResponse.keyPattern).includes("email")){
                        response.status(400).json({error: 'Account with this email already exists. Please use another email.'});
                        return;
                    }
                    else if(Object.keys(error.errorResponse.keyPattern).includes("username")){
                        response.status(400).json({error: 'Username already taken. Please try another username.'});
                        return;
                    }
            }
            response.status(400).json({error: "Unable to create an account. Please try again"});
            return;
        }
        else if(error.name === errors.NotCurrentPlayerError.name){
            response.status(400).json({error: error.message});
            return;
        }
        else{
            //TODO: make app errors less generic.
            console.log(error.message);
            response.status(400).json({error: "Something went wrong. Please try again later."})
        }
    }
    next(error)
}

export default {
    parseGameSetup,
    getGame,
    extractToken,
    extractUser,
    parseNewAccount,
    errorHandler,
    parseEmail
}