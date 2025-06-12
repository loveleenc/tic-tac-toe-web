import { Game } from "../types";

declare namespace Express {
    interface ExistingGameRequest extends Request {
        game: Game;
    }
}

export type ExistingGameRequest = ExistingGameRequest
