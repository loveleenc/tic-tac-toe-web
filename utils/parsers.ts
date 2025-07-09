import { Game, GameDifficulty, GameType, playerSymbol, Setup } from "../types/types";

const isGameSetupData = (object: unknown): Setup => {
  if (!object || typeof object !== "object") {
    throw new Error("request body is not available");
  }
  if (
    "players" in object &&
    "width" in object &&
    "height" in object &&
    "minMoves" in object &&
    "disableSquares" in object &&
    "gameType" in object &&
    "difficulty" in object
  ) {
    const setup: Setup = {
      players: parsePlayers(object.players),
      width: parseWidth(object.width),
      height: parseWHeight(object.height),
      minMoves: parseMinMoves(object.minMoves),
      disableSquares: parseDisableSquares(object.disableSquares),
      gameType: parseGameType(object.gameType),
      difficulty: parseGameDifficulty(object.difficulty),
    };
    return setup;
  }
  throw new Error("game setup data appears to be missing a few details");
};

const parseId = (id: unknown, game:Game):number => {
  if(!isValidId(id, game)){
    throw new Error("provided id is incorrect");
  }
  return id
}

const isValidId = (id:unknown, game:Game):id is number => {
  return id !== null && typeof id === "number" && !isNaN(id) && (id < (game.width * game.height));
}

const parsePlayers = (players: unknown): playerSymbol[] => {
  if (!isPlayers(players)) {
    throw new Error("Is not a correct player symbol");
  }
  return players;
};

const parseWHeight = (height: unknown): number => {
  if (!isHeight(height)) {
    throw new Error("height is incorrect");
  }
  return height;
};

const parseWidth = (width: unknown): number => {
  if (!isWidth(width)) {
    throw new Error("width is incorrect");
  }
  return width;
};

const parseMinMoves = (minMoves: unknown): number => {
  if (!isMinMoves(minMoves)) {
    throw new Error("min moves is incorrect");
  }
  return minMoves;
};

const parseDisableSquares = (disableSquares: unknown): boolean => {
  if (!isdisableSquares(disableSquares)) {
    throw new Error("disable squares is incorrect");
  }
  return disableSquares;
};

const parseGameType = (gameType: unknown): string => {
  if(!isGameType(gameType)){
    throw new Error("Game type is incorrect");
  }
  return gameType;
}

const isGameType = (gameType: unknown): gameType is GameType => {
  return (
    gameType !== null &&
    typeof gameType === "string" &&
      Object.values(GameType).map(value => value.toString()).includes(gameType))
}

const parseGameDifficulty = (difficulty: unknown):string | null => {
  if(!isGameDifficulty(difficulty)){
    throw new Error("Game difficulty is incorrect");
  }
  return difficulty;
}

const isGameDifficulty = (difficulty: unknown): difficulty is GameDifficulty | null => {
  if(difficulty === null){
    return true;
  }
  return (
    typeof difficulty === "string" &&
    Object.values(GameDifficulty).map(value => value.toString()).includes(difficulty)
  )
}

const isPlayers = (players: unknown): players is playerSymbol[] => {
  return (
    players !== null &&
      Array.isArray(players) &&
      players.map((p) => isPlayerSymbol(p)).reduce((a, c) => a && c),
    true
  );
};

const isPlayerSymbol = (symbol: unknown): symbol is playerSymbol => {
  return (
    symbol !== null &&
    (typeof symbol === "string" || symbol instanceof String) &&
    symbol.length === 1
  );
};

const isWidth = (width: unknown): width is number => {
  return width !== null && typeof width === "number" && !isNaN(width);
};

const isHeight = (height: unknown): height is number => {
  return height !== null && typeof height === "number" && !isNaN(height);
};

const isMinMoves = (minMoves: unknown): minMoves is number => {
  return minMoves !== null && typeof minMoves === "number" && !isNaN(minMoves);
};

const isdisableSquares = (
  disableSquares: unknown
): disableSquares is boolean => {
  return disableSquares !== null && typeof disableSquares === "boolean";
};

export default {
  isGameSetupData,
  parseId,
  parsePlayers
};
