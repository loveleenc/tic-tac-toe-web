import { ReturnedUser } from "../types/models";
import { Game, Player, playerSymbol, Grid, Row, Cell, GameStatus, OutgoingGameData, NonSensitivePlayer, GameType, GameDifficulty, NewGameData} from "../types/types";
import computerService from "./computerService";
import scoreService from "./scoreService";
import { v4 as uuidv4 } from "uuid";
import {addGameId, deleteGame} from "../data/liveData";
import errors from "../utils/errors";
import parsers from "../utils/parsers";

const createNewGame = (gameData: NewGameData, user:ReturnedUser) => {
  const game: Game = {
      width: gameData.width,
      height: gameData.height,
      minMoves: gameData.minMoves,
      squares: gameData.disableSquares
        ? selectSquaresToDisable(
            gameData.width,
            gameData.height
          )
        : [],
      difficulty: gameData.difficulty,
      gameType: gameData.gameType,
      hasStarted: gameData.gameType === GameType.SINGLEPLAYER ? true : false,
      playerData: [],
    };

  const filteredPlayers = createAllPlayerData(gameData.players, user.username, game);
  const gameId = uuidv4();
  addGameId(gameId, game);
  
  const outgoingGameData: OutgoingGameData = {
      grid: createGridArray(game),
      playerData: filteredPlayers,
      status:
        game.gameType === GameType.SINGLEPLAYER
          ? GameStatus.ONGOING
          : GameStatus.NOTSTARTED,
      winner: null,
  };
  
  const data = {
    gameId: gameId,
    outgoingGameData: outgoingGameData,
  }  
  return data;
}

const createInitialPlayerData = (players:playerSymbol[], username: string, gameType: GameType):Player[] => {
  const template:Player = {
    symbol: '',
    moves: [],
    turn: false,
    isComputer: false,
    username: null
  };
  const data:Player[] = new Array();

  for (let i = 0; i < players.length; i++) {
    data.push({
      ...template,
      moves: template.moves.slice(),
      symbol: players[i],
    });
  }

  if(gameType === GameType.SINGLEPLAYER || gameType === GameType.MULTIPLAYER){
    data[0].username = username;
  }
  if (gameType === GameType.SINGLEPLAYER) {
    const computerSymbol:playerSymbol = createComputerPlayer(players);
    data.push({ ...template, symbol: computerSymbol, isComputer: true });
    selectFirstPlayer(data);
  }
  return data;
};

const createComputerPlayer = (players:string[]):playerSymbol => {
  let computer = '';
  function getRandomCharacter() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const randomIndex = Math.floor(Math.random() * characters.length);
    computer = characters.charAt(randomIndex);
  }

  function symbolIsTaken():boolean {
    for (const player of players) {
      if (player === computer) {
        return true;
      }
    }
    return false;
  }
  while (symbolIsTaken() || computer === '') {
    getRandomCharacter();
  }
  return computer;
};

const selectFirstPlayer = (data:Player[]):void => {
  const randomIndex = Math.floor(Math.random() * data.length);
  data[randomIndex].turn = true;
};

const playGame = async (user:ReturnedUser, game:Game, gridSquareId:number):Promise<OutgoingGameData> => {
  const id = parsers.parseId(gridSquareId, game);
  if(gameHasNotStarted(game)){
    throw new errors.GameNotStartedError();
  }
  if(!currentPlayerHasSentTheRequest(user, game)){
    throw new errors.NotCurrentPlayerError();
  }
  const outgoingGameData = await updateGameState(id, game);
  return outgoingGameData
}

const updateGameState = async (id:number, game:Game):Promise<OutgoingGameData> => {
  let outgoingGameData = await verifyAndUpdateGameState(id, game)
  if(game.playerData.find(p => p.turn === true && p.isComputer === true)){
        const new_id = playAsComputer(game)
        outgoingGameData = await verifyAndUpdateGameState(new_id, game)
  }
  return outgoingGameData
}

const verifyAndUpdateGameState = async (id:number, game:Game):Promise<OutgoingGameData> => {
    game.playerData = updateMoveInPlayerData(game.playerData, id)
    const updatedGame:OutgoingGameData = {
      status: GameStatus.ONGOING,
      winner: null,
      playerData: filterPlayerData(game.playerData)
    }
    if(hasCurrentPlayerHasWon(game)){
        const winner = game.playerData.find(player => player.turn === true)
        if(!winner){
          throw new Error("unable to find the current player who has won")
        }
        await scoreService.addWinToUserScore(winner.username);
        game.playerData.forEach(async (player) => {
          if(player.turn === false){
            await scoreService.addLossToUserScore(player.username);
          }
        })
        updatedGame.status = GameStatus.END
        updatedGame.winner= winner.symbol
        deleteGame
    }
    else if (nobodyWins(game)){
      updatedGame.status = GameStatus.END
      updatedGame.winner = null
      game.playerData.forEach(async (player) => {
        await scoreService.addTieToUserScore(player.username);
      })
    }
    else{
        selectNextPlayer(game.playerData)
        updatedGame.status = GameStatus.ONGOING
        updatedGame.winner= null
        updatedGame.playerData= filterPlayerData(game.playerData)
        updatedGame.grid= createGridArray(game)
    }
    return updatedGame
}

const addNewPlayer = (playerSymbol:playerSymbol, user:ReturnedUser, game:Game): {symbol: string} & {game: OutgoingGameData} => {
  const player = playerAlreadyExistsInGame(user, game)
  if(player !== undefined){
    const outgoingGameData:OutgoingGameData = {
      winner: null,
      status: GameStatus.ONGOING,
      playerData: filterPlayerData(game.playerData),
      grid: createGridArray(game),
    }
    return {symbol: player.symbol, game: outgoingGameData};
  }

  const template:Player = {
    symbol: playerSymbol,
    moves: [],
    turn: false,
    isComputer: false,
    username: user.username
  };

  game.playerData.push(template);
  if(!game.hasStarted){
    game.hasStarted = true;
  }

  if(game.playerData.length === 2){
    selectNextPlayer(game.playerData);
  }
  const outgoingGameData:OutgoingGameData = {
      winner: null,
      status: GameStatus.ONGOING,
      playerData: filterPlayerData(game.playerData),
      grid: createGridArray(game),
    }
  return {symbol: playerSymbol, game: outgoingGameData};
}

const createAllPlayerData = (players:playerSymbol[], username:string, game:Game):NonSensitivePlayer[] => {
  game.playerData = createInitialPlayerData(players, username, game.gameType)
  playFirstMove(game)
  return filterPlayerData(game.playerData)
}

const playFirstMove = (game:Game):void => {
  if(game.playerData.find(p => p.turn === true && p.isComputer === true) !== undefined){
      const id = playAsComputer(game)
      game.playerData = updateMoveInPlayerData(game.playerData, id)
      selectNextPlayer(game.playerData)
  }
}

const playAsComputer = (game:Game):number => {
  switch(game.difficulty){
    case (GameDifficulty.EASY):
      return computerService.easyMode(game);
    case (GameDifficulty.MEDIUM):
      return computerService.mediumMode(game);
    case (GameDifficulty.HARD):
      return computerService.hardMode(game);
    default:
      throw new Error("Difficult level does not match with expected ones");
  }
};

const filterPlayerData = (playerData:Player[]):NonSensitivePlayer[] => {
  const filteredPlayers = playerData.map(p => {
    const {username, ...remainingData} = p
    const filteredPlayer:NonSensitivePlayer = {
      ...remainingData
    }
    return filteredPlayer
  })
  return filteredPlayers
}

const updateMoveInPlayerData = (playerData:Player[], id:number):Player[] => {
  const currentPlayerIndex = playerData.findIndex(
    (player) => player.turn === true
  );
  const newPlayerData = playerData.slice();
  newPlayerData[currentPlayerIndex].moves.push(id);
  return newPlayerData;
};

const selectNextPlayer = (playerData:Player[]):void  => {
  const currentPlayerIndex = playerData.findIndex(
    (player) => player.turn === true
  );
  if(currentPlayerIndex === -1){
    playerData[0].turn = true;
    return;
  }
  if (currentPlayerIndex + 1 === playerData.length) {
    playerData[0].turn = true;
  } else {
    playerData[currentPlayerIndex + 1].turn = true;
  }
  playerData[currentPlayerIndex].turn = false;
};

const createGridArray = (game:Game):Grid => {
  const grid:Grid = [];
  let count = 0;
  for (let i = 0; i < game.height; i++) {
    let row:Row = [];
    for (let j = 0; j < game.width; j++) {
      let text:Cell["text"] = "";
      for (const player of game.playerData) {
        if (player.moves.includes(count)) {
          text = player.symbol;
          break;
        }
      }
      if (text === "" && game.squares.includes(count)) {
        text = null;
      }
      row.push({ count: count, text: text});
      count += 1;
    }
    grid.push(row);
  }
  return grid;
};

function* range(start:number, stop:number, step = 1) {
  if (stop == null) {
    stop = start;
    start = 0;
  }

  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    yield i;
  }
}

const hasWon = (ids:number[], playerData:Player[], minMoves:number):boolean => {
  const currentPlayer = playerData.find((player) => player.turn === true)
  if(!currentPlayer){
    throw new Error("Unable to find current player")
  }
  ids = ids.sort((a, b) => a - b);
  const moves = currentPlayer.moves;
  let count = 0;
  for (const id of ids) {
    if (moves.includes(id)) {
      count += 1;
    }
    else{
      count = 0;
    }
    if (count === minMoves) {
      return true;
    }
  }
  return false;
};

const hasCurrentPlayerHasWon = (game:Game):boolean => {
  const currentPlayer = game.playerData.find(player => player.turn === true) as Player;
  const id = currentPlayer.moves[currentPlayer.moves.length - 1];
  const maxCount = game.width * game.height - 1;
  const leftList = new Array();
  leftList.push(0);
  const rightList = new Array();
  rightList.push(game.width - 1);
  for (let i = 1; i < game.height; i++) {
    leftList.push(leftList.slice(-1)[0] + game.width);
    rightList.push(rightList.slice(-1)[0] + game.width);
  }

  const vertical = new Array();
  for (let i of range(id - (game.minMoves - 1) * game.width, id + game.width, game.width)) {
    if (i < 0) {
      continue;
    }
    vertical.push(i);
  }
  for (let i of range(id + game.width, id + game.minMoves * game.width, game.width)) {
    if (i > maxCount) {
      break;
    }
    vertical.push(i);
  }

  const horizontal = new Array();
  for (let i of range(id, id - game.minMoves, -1)) {
    if (i == id) {
      horizontal.push(i);
      continue;
    }

    if (rightList.includes(i)) {
      break;
    }
    horizontal.push(i);
  }
  for (let i of range(id + 1, id + game.minMoves)) {
    if (leftList.includes(i)) {
      break;
    }
    horizontal.push(i);
  }
  horizontal.sort();

  const diagonal1 = new Array();
  for (let i of range(id, id - game.minMoves * (game.width + 1), -(game.width + 1))) {
    if (i == id) {
      diagonal1.push(i);
      continue;
    }

    if (i < 0 || rightList.includes(i)) {
      break;
    }
    diagonal1.push(i);
  }
  for (let i of range(id + game.width + 1, id + game.minMoves * (game.width + 1), game.width + 1)) {
    if (i > maxCount || leftList.includes(i)) {
      break;
    }
    diagonal1.push(i);
  }
  diagonal1.sort();

  const diagonal2 = new Array();
  for (let i of range(id - (game.width - 1) * (game.minMoves - 1), id, game.width - 1)) {
    if (leftList.includes(i) || i < 0) {
      continue;
    }
    diagonal2.push(i);
  }

  for (let i of range(id, id + (game.width - 1) * game.minMoves, game.width - 1)) {
    if (i == id) {
      diagonal2.push(i);
      continue;
    }
    if (rightList.includes(i) || i > maxCount) {
      break;
    }
    diagonal2.push(i);
  }

  return (
    hasWon(vertical, game.playerData, game.minMoves) ||
    hasWon(horizontal, game.playerData, game.minMoves) ||
    hasWon(diagonal1, game.playerData, game.minMoves) ||
    hasWon(diagonal2, game.playerData, game.minMoves)
  );
};

const nobodyWins = (game:Game):boolean => {
  const total_moves = game.playerData
    .map((player) => player.moves.length)
    .reduce((a, c) => a + c, 0);
  return game.squares.length + total_moves === game.width * game.height;
};

const selectSquaresToDisable = (width:Game["width"], height:Game["height"]):Game["squares"] => {
  let squares:Game["squares"] = new Array();
  for (let i = 0; i < Math.floor((width * height) / 3); i++) {
    squares.push(Math.floor(Math.random() * (width * height - 1)));
  }
  squares = [...new Set(squares)];
  return squares;
};

const restartGame = (game:Game):OutgoingGameData => {
  game.playerData.forEach(player => player.moves = [])
    const outgoingGameData:OutgoingGameData = {
        playerData: filterPlayerData(game.playerData),
        status: GameStatus.ONGOING,
        winner: null,
        grid: createGridArray(game)
    }
    return outgoingGameData
}

const currentPlayerHasSentTheRequest = (user:ReturnedUser, game:Game):boolean => {
  const currentPlayer = game.playerData.find(player => player.turn === true)
  if(!currentPlayer){
    throw new Error("unable to find the current player")
  }
  return user.username === currentPlayer.username
}

const playerAlreadyExistsInGame = (user:ReturnedUser, game: Game):Player | undefined => {
  const player = game.playerData.find(player => player.username === user.username)
  return player;
}

const playerSymbolAlreadyChosen = (symbol:playerSymbol, game:Game):boolean => {
  const playerWithMatchingSymbol = game.playerData.find(player => player.symbol.toLowerCase() === symbol.toLowerCase())
  return playerWithMatchingSymbol !== undefined;
}

const gameHasNotStarted = (game:Game) => {
  return game.playerData.length < 2 && game.hasStarted === false;
}

export default {
  createNewGame,
  playGame,
  restartGame,

  selectNextPlayer,
  hasCurrentPlayerHasWon,
  nobodyWins,
  addNewPlayer,

  updateMoveInPlayerData, //Does this need to be in this file?

  playerAlreadyExistsInGame,  //TODO: Placeholder, func to be removed or used later
  playerSymbolAlreadyChosen, //TODO: Placeholder, func to be removed or used later
};