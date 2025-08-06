import { io } from "socket.io-client";

class Socket{
    socket;
    constructor(){
        this.socket = io();
    }

    gameJoin(){
        this.socket.on('joinGame', )
    }
}