import { Server } from 'socket.io';
import {parse} from 'cookie';
import userService from "../services/userService";
import { LoggedInUserSocketRequest } from "../types/socket/request";
import {  Player } from "../types/types";
import gameService from "../services/gameService";
import { getGameWithId } from "../data/liveData";
import http from 'node:http';

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
                    next(error);
                }
            }
        }
        else{
            next(new Error("Cookies appear to be missing in request"));
        }
    });


    this.socketServer.on('connection', (socket:LoggedInUserSocketRequest) => {
        socket.on('newGame', (gameId:string) => {
            socket.join(gameId);
            socket.gameId = gameId;
        });

        socket.on('joinGame', (gameId:string, symbol:Player["symbol"]) => {
            socket.join(gameId);
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
                socket.to(gameId).emit('playerJoined', gameAndPlayerData, socket.user.username);
                socket.emit('joinedGame', gameAndPlayerData);
                socket.gameId = gameId;
            }
        });


        socket.on('disconnect', (reason:string) => {
            console.log(`socket disconnected: ${reason}`);
            socket.to(socket.gameId).emit('playerLeft', socket.user.username);
        })
    })

}

}

export default SocketServer