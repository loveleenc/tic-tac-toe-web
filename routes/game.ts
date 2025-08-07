import { Router, Response, NextFunction } from "express";
import middleware from "../utils/middleware";
import {
  Game,
  GameStatus,
  NewGameData,
  OutgoingGameData,
} from "../types/types";
import gameService from "../services/gameService";
import {deleteGame} from "../data/liveData";
import {
  ExistingGameRequest,
  LoggedInUserRequest,
} from "../types/express/request";

const gameRouter = Router();

gameRouter.post(
  "/",
  [middleware.extractUser, middleware.parseGameSetup], async (request: LoggedInUserRequest, response: Response<OutgoingGameData>) => {
    const newGameData:NewGameData = {
      width: request.body.width,
      height: request.body.height,
      minMoves: request.body.minMoves,
      disableSquares: request.body.disableSquares,
      difficulty: request.body.difficulty,
      gameType: request.body.gameType,
      players: request.body.players,
    }
    const data = gameService.createNewGame(newGameData, request.user);
    response.cookie("gameId", data.gameId);
    response.json(data.outgoingGameData);
    return;
  }
);

gameRouter.patch(
  "/",
  [middleware.extractUser, middleware.getGame],
  async (
    request: ExistingGameRequest,
    response: Response,
    next: NextFunction
  ) => {
    try{
        const outgoingGameData = await gameService.playGame(request.user, request.game, request.body.id);
      if (outgoingGameData.status === GameStatus.END) {
        deleteGame(request.cookies.gameId);
      }
      response.json(outgoingGameData);
    }
    catch(error:unknown){
      next(error);
    }
    
    next();
  }
);

gameRouter.delete(
  "/",
  [middleware.extractUser, middleware.getGame],
  async (request: ExistingGameRequest, response: Response) => {
    deleteGame(request.cookies.gameId)
    response.status(204).end();
  }
);

gameRouter.put(
  "/",
  [middleware.extractUser, middleware.getGame],
  async (
    request: ExistingGameRequest,
    response: Response<OutgoingGameData>
  ) => {
    const game: Game = request.game;
    const outgoingGameData: OutgoingGameData = gameService.restartGame(game);
    response.json(outgoingGameData);
  }
);

// gameRouter.patch(
//   "/join",
//   [middleware.extractUser, middleware.getGame],
//   async (
//     request: ExistingGameRequest,
//     response: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const game: Game = request.game;
//       if (gameService.playerAlreadyExistsInGame(request.user, game)) {
//         response
//           .status(400)
//           .json({ error: "Player already exists in the game" });
//         return;
//       }

//       const symbol: playerSymbol = parsers.parsePlayers(request.body.symbol)[0];
//       if (gameService.playerSymbolAlreadyChosen(symbol, game)) {
//         response
//           .status(400)
//           .json({
//             error:
//               "Player symbol already exists in game. Please choose another from the list",
//                 symbols: game.playerData.map((player) => player.symbol),
//           });
//         return;
//       }
//       const newPlayer:NonSensitivePlayer = gameService.addNewPlayer(symbol, request.user.username, game);
//       response.json(newPlayer);
//       return; //TODO: the notification sent out to all players needs to update the gameStatus in outgoing game data

//     } catch (error: unknown) {
//       let errorMessage = "something went wrong. ";
//       if (error instanceof Error) {
//         errorMessage += error.message;
//       }
//       response.status(400).json({ error: errorMessage });
//       next(error);
//     }
//   }
// );

export default gameRouter;
