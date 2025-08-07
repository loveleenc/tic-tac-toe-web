import { Socket } from "socket.io";


declare namespace Socket{
    interface LoggedInUserSocketRequest extends Socket{
        user: ReturnedUser,
        gameId: string,
    }
}

export type LoggedInUserSocketRequest = LoggedInUserSocketRequest;