import { Router, Response, NextFunction } from "express";
import middleware from "../utils/middleware";
import {
  Game,
  GameStatus,
  GameType,
  NonSensitivePlayer,
  OutgoingGameData,
  playerSymbol,
} from "../types/types";
import gameService from "../services/gameService";
import { v4 as uuidv4 } from "uuid";
import getGames from "../data/liveData";
import {
  ExistingGameRequest,
  LoggedInUserRequest,
} from "../types/express/request";
import parsers from "../utils/parsers";

const gameRouter = Router();

gameRouter.post(
  "/",
  [middleware.extractUser, middleware.parseGameSetup],
  async (
    request: LoggedInUserRequest,
    response: Response<OutgoingGameData>
  ) => {
    const game: Game = {
      width: request.body.width,
      height: request.body.height,
      minMoves: request.body.minMoves,
      squares: request.body.disableSquares
        ? gameService.selectSquaresToDisable(
            request.body.width,
            request.body.height
          )
        : [],
      difficulty: request.body.difficulty,
      gameType: request.body.gameType,
      hasStarted:
        request.body.gameType === GameType.SINGLEPLAYER ? true : false,
      playerData: [],
    };
    const filteredPlayers = gameService.createAllPlayerData(
      request.body.players,
      request.user.username,
      game
    );

    const games = getGames();
    const gameId = uuidv4();
    games[gameId] = game;
    response.cookie("gameId", gameId);
    const outgoingGameData: OutgoingGameData = {
      grid: gameService.createGridArray(game),
      playerData: filteredPlayers,
      status:
        game.gameType === GameType.SINGLEPLAYER
          ? GameStatus.ONGOING
          : GameStatus.NOTSTARTED,
      winner: null,
    };
    response.json(outgoingGameData);
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
    try {
      const game = request.game;
      if (!gameService.currentPlayerHasSentTheRequest(request.user, game)) {
        response
          .status(400)
          .json({ error: "only the current player can play the game" });
        return;
      }
      const id = parsers.parseId(request.body.id, game);
      const outgoingGameData = await gameService.updateGameState(id, game);
      if (outgoingGameData.status === GameStatus.END) {
        delete getGames()[request.cookies.gameId];
      }
      response.json(outgoingGameData);
      next();
    } catch (error: unknown) {
      let errorMessage = "something went wrong. ";
      if (error instanceof Error) {
        errorMessage += error.message;
      }
      response.status(400).json({ error: errorMessage });
      next(error);
    }
  }
);

gameRouter.delete(
  "/",
  [middleware.extractUser, middleware.getGame],
  async (request: ExistingGameRequest, response: Response) => {
    delete getGames()[request.cookies.gameId];
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

gameRouter.patch(
  "/join",
  [middleware.extractUser, middleware.getGame],
  async (
    request: ExistingGameRequest,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const game: Game = request.game;
      if (gameService.playerAlreadyExistsInGame(request.user, game)) {
        response
          .status(400)
          .json({ error: "Player already exists in the game" });
        return;
      }

      const symbol: playerSymbol = parsers.parsePlayers(request.body.symbol)[0];
      if (gameService.playerSymbolAlreadyChosen(symbol, game)) {
        response
          .status(400)
          .json({
            error:
              "Player symbol already exists in game. Please choose another from the list",
                symbols: game.playerData.map((player) => player.symbol),
          });
        return;
      }
      const newPlayer:NonSensitivePlayer = gameService.addNewPlayer(symbol, request.user.username, game);
      response.json(newPlayer);
      return; //TODO: the notification sent out to all players needs to update the gameStatus in outgoing game data

    } catch (error: unknown) {
      let errorMessage = "something went wrong. ";
      if (error instanceof Error) {
        errorMessage += error.message;
      }
      response.status(400).json({ error: errorMessage });
      next(error);
    }
  }
);

export default gameRouter;
