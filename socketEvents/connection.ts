import { Server } from 'socket.io';
import {parse} from 'cookie';
import userService from "../services/userService";
import { LoggedInUserSocketRequest } from "../types/socket/request";
import {  Player } from "../types/types";
import gameService from "../services/gameService";
import { getGameWithId } from "../data/liveData";
import http from 'node:http';

// import parsers from "../utils/parsers";
// import {NewGameData}from "../types/types";

class SocketServer{
    socketServer:Server;
    constructor(server:http.Server){
        this.socketServer = new Server(server);
    
    this.socketServer.use(async (socket:LoggedInUserSocketRequest, next) => {
        if(socket.request.headers.cookie !== undefined){
            try{
                const cookie = parse(socket.request.headers.cookie);
                socket.user = await userService.extractUserFromToken(cookie.token);
                next();
            }
            catch(error: unknown){
                if(error instanceof Error){
                    console.log(`error thrown: ${error.message}` )
                    next(error);
                }
            }
        }
        else{
            next(new Error("Cookies appear to be missing in request"));
        }
    });


    this.socketServer.on('connection', (socket:LoggedInUserSocketRequest) => {
        console.log('blahhhhh');

        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
        // socket.on('createGame', async (gameData:NewGameData) => {
        //     try{
        //         parsers.isGameSetupData(gameData);
        //     }
        //     catch(error: unknown){
        //         let errorMessage = 'something went wrong. '
        //         if(error instanceof Error){
        //             errorMessage += error.message
        //         }
        //         socket.emit('createGame', {error: errorMessage});
        //         return;
        //     }
        //     const newGameData:NewGameData = {
        //         width: gameData.width,
        //         height: gameData.height,
        //         minMoves: gameData.minMoves,
        //         disableSquares: gameData.disableSquares,
        //         difficulty: gameData.difficulty,
        //         gameType: gameData.gameType,
        //         players: gameData.players,
        //     };
        //     const data = gameService.createNewGame(newGameData, socket.user);
        //     socket.join(data.gameId);
        //     socket.to(data.gameId).emit('createGame', data.outgoingGameData, data.gameId);
        // })

        socket.on('joinGame', async (gameId:string, symbol:Player["symbol"]) => {
            const game = getGameWithId(gameId);
            if(game === undefined){
                socket.emit('joinGame', {error: `Game with id ${gameId} does not exist`});
                socket.disconnect();
            }
            else if(gameService.playerSymbolAlreadyChosen(symbol, game)){
                socket.emit('joinGame', {error: `Symbol already chosen. Please select another. Already selected symbols are: ${game.playerData.map(p => p.symbol).join(", ")}`})
                socket.disconnect();
            }
            else{
                const gameAndPlayerData = gameService.addNewPlayer(symbol, socket.user, game);
                socket.to(gameId).emit('joinGame', gameAndPlayerData);
            }
        });
    })

}

}

export default SocketServer