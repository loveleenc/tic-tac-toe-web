import { UserModel, ReturnedUser } from "../models";
import { Game } from "../types";

declare namespace Express {
    interface LoggedInUserRequest extends Request{
        token: string;
        user: ReturnedUser
    }

    interface ExistingGameRequest extends LoggedInUserRequest {
        game: Game;
    }
}

export type ExistingGameRequest = ExistingGameRequest
export type LoggedInUserRequest = LoggedInUserRequest
