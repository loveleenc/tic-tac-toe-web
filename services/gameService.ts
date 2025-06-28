import { ReturnedUser } from "../types/models";
import { Game, Player, playerSymbol, Grid, Row, Cell, GameStatus, OutgoingGameData, NonSensitivePlayer} from "../types/types";
import scoreService from "./scoreService";


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

const createInitialPlayerData = (players:playerSymbol[], username: string):Player[] => {
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

  if (players.length === 1) {
    data[0].username = username
    const computerSymbol:playerSymbol = createComputerPlayer(players);
    data.push({ ...template, symbol: computerSymbol, isComputer: true });
  }
  selectFirstPlayer(data);
  return data;
};

const createAllPlayerData = (players:playerSymbol[], username:string, game:Game):NonSensitivePlayer[] => {
  game.playerData = createInitialPlayerData(players, username)
  playFirstMove(game)
  return filterPlayerData(game.playerData)
}

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

const playFirstMove = (game:Game):void => {
  if(game.playerData.find(p => p.turn === true && p.isComputer === true)){
      const id = playAsComputer(game)
      game.playerData = updateMoveInPlayerData(game.playerData, id)
      selectNextPlayer(game.playerData)
  }
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
  if (currentPlayerIndex + 1 === playerData.length) {
    playerData[0].turn = true;
  } else {
    playerData[currentPlayerIndex + 1].turn = true;
  }
  playerData[currentPlayerIndex].turn = false;
};


const playAsComputer = (game:Game):number => {
  let move;
  const all_moves = game.playerData
    .map((p) => p.moves)
    .reduce((a, c) => a.concat(c), new Array())
    .concat(game.squares);
    if (1 + all_moves.length === game.width * game.height) {
      for (let i = 0; i < game.width * game.height; i++) {
        if (!all_moves.includes(i)) {
          move = i;
          return move;
        }
      }
    }
    move = Math.floor(Math.random() * (game.width * game.height - 1));
    while (all_moves.includes(move)) {
      move = Math.floor(Math.random() * (game.width * game.height - 1));
    }
  return move;
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
  const moves = currentPlayer.moves;
  let count = 0;
  for (const id of ids) {
    if (moves.includes(id)) {
      count += 1;
    }
    if (count === minMoves) {
      return true;
    }
  }
  return false;
};

const hasCurrentPlayerHasWon = (id:number, game:Game):boolean => {
  const maxCount = game.width * game.height - 1;
  const leftList = [0];
  const rightList = [game.width - 1];
  for (let i = 1; i < game.height; i++) {
    leftList.push(leftList.slice(-1)[0] + game.width);
    rightList.push(rightList.slice(-1)[0] + game.width);
  }

  const vertical = [];
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

  const horizontal = [];
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

  const diagonal1 = [];
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

  const diagonal2 = [];
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

const updateGameState = (id:number, game:Game):OutgoingGameData => {
  let outgoingGameData = verifyAndUpdateGameState(id, game)
  if(game.playerData.find(p => p.turn === true && p.isComputer === true)){
        const new_id = playAsComputer(game)
        outgoingGameData = verifyAndUpdateGameState(new_id, game)
  }
  return outgoingGameData
}

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

const verifyAndUpdateGameState = (id:number, game:Game):OutgoingGameData => {
    game.playerData = updateMoveInPlayerData(game.playerData, id)
    const updatedGame:OutgoingGameData = {
      status: GameStatus.ONGOING,
      winner: null,
      playerData: filterPlayerData(game.playerData)
    }
    if(hasCurrentPlayerHasWon(id, game)){
        const winner = game.playerData.find(player => player.turn === true)
        if(!winner){
          throw new Error("unable to find the current player who has won")
        }
        // scoreService.addWinToUserScore(winner.username);
        updatedGame.status = GameStatus.END
        updatedGame.winner= winner.symbol
    }
    else if (nobodyWins(game)){
      updatedGame.status = GameStatus.END
      updatedGame.winner= null
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

export default {
  restartGame,
  updateGameState,
  verifyAndUpdateGameState,
  createInitialPlayerData,
  updateMoveInPlayerData,
  createGridArray,
  selectNextPlayer,
  hasCurrentPlayerHasWon,
  nobodyWins,
  selectSquaresToDisable,
  playAsComputer,
  createAllPlayerData,
  currentPlayerHasSentTheRequest
};