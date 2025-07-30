import { Game, Player } from "../types/types";
import gameService from "./gameService";

function getRandomInt(max:number) {
  return Math.floor(Math.random() * max);
}

const easyMode = (game: Game):number => {
  const availableMoves = gameService.getAvailableMoves(game);
  return availableMoves[getRandomInt(availableMoves.length - 1)];
}

const mediumMode = (game:Game): number => {
  const randomMove = getRandomInt(2) === 1 ? true : false
  if(gameService.firstPlayerIsComputer(game) || randomMove){
    return easyMode(game);
  }
  return playUsingMinimax(game);
}

const hardMode = (game:Game): number => {
  if(gameService.firstPlayerIsComputer(game)){
    const move1 = easyMode(game);
    return move1;
  }
  const move = playUsingMinimax(game);
  return move;
}

const playUsingMinimax = (game:Game): number => {
  const availableMoves = gameService.getAvailableMoves(game);
  let bestMove = -1;
  let bestScore = -10;
  let alpha = -Infinity;
  let beta = +Infinity;
  for(const move of availableMoves){
    const updatedGame = playMove(move, game);
    const score = minimax(updatedGame, 0, alpha, beta); 
    if(score >= bestScore){
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}

const isGameOver = (game:Game, depth:number):number | null => {
  if(hasCurrentPlayerHasWon(game, false)){
    const winner = game.playerData.find(player => player.turn === true)
    if(winner?.isComputer === true){
      return 10-depth;
    }
     return -10-depth;
  }
  else if(gameService.nobodyWins(game)){
    return 0-depth;
  }
  return null;
}

const minimax = (game:Game, depth:number, alpha:number, beta:number) => {
  const gameScore = isGameOver(game, depth)
  if(gameScore !== null){
    return gameScore;
  }
    if(!(game.width === 3 && game.height === 3)){
      if(game.minMoves >= 3 && depth > ((game.minMoves * game.minMoves) - 1) / Math.max(game.width, game.height)){
      return -10 - depth;
    }
  }
  
  
  gameService.selectNextPlayer(game.playerData);
  const availableMoves = gameService.getAvailableMoves(game);
  let bestScore;
  if(game.playerData.find(player => player.isComputer === true && player.turn === true) !== undefined){
    bestScore = 10-depth;
  }
  else{
    bestScore = -10-depth;
  }
  for(const move of availableMoves){
    const updatedGame = playMove(move, game);
    const score = minimax(updatedGame, depth + 1, alpha, beta);
    if(updatedGame.playerData.find(player => player.isComputer === true && player.turn === true) !== undefined){
      bestScore = Math.max(score, bestScore);
      alpha = Math.max(alpha, bestScore)
      if(beta <= alpha){
        break;
      }
    }
    else{
      bestScore = Math.min(score, bestScore);
      beta = Math.min(beta, bestScore);
      if(beta <= alpha){
        break;
      }
    }
  }
  return bestScore;
}

const playMove = (move:number, game:Game):Game => {
  const gameCopy:Game = createGameCopy(game);
  gameCopy.playerData = gameService.updateMoveInPlayerData(gameCopy.playerData, move);
  return gameCopy;
}

const createGameCopy = (game:Game):Game => {
  const gameCopy:Game = {
    ...game,
    playerData: createPlayerDataCopy(game.playerData),
  }
  return gameCopy;
}

const createPlayerDataCopy = (playerData:Player[]):Player[] => {
  const playerDataCopy = new Array();
  playerData.forEach(player => {
    playerDataCopy.push({
      ...player,
      moves: player.moves.slice()
    })
  })
  return playerDataCopy;
}

const hasWon = (ids:number[], playerData:Player[], minMoves:number, notmini:boolean):boolean => {
  const currentPlayer = playerData.find((player) => player.turn === true)
  if(!currentPlayer){
    throw new Error("Unable to find current player")
  }
  ids = ids.sort();
  const moves = currentPlayer.moves;
  if(notmini){
    console.log(`player is: ${currentPlayer.symbol}`)
    console.log(`moves: ${moves.join(",")}`)
    console.log(`ids: ${ids.join(",")}`)
  }
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

const hasCurrentPlayerHasWon = (game:Game, notmini:boolean):boolean => {
  const currentPlayer = game.playerData.find(player => player.turn === true) as Player;
  const id = currentPlayer.moves[currentPlayer.moves.length - 1];
  if(!currentPlayer.isComputer){
    // console.log(`latest move is: ${id}`);
  }
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
    hasWon(vertical, game.playerData, game.minMoves, notmini) ||
    hasWon(horizontal, game.playerData, game.minMoves, notmini) ||
    hasWon(diagonal1, game.playerData, game.minMoves, notmini) ||
    hasWon(diagonal2, game.playerData, game.minMoves, notmini)
  );
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

export default {
    easyMode,
    mediumMode,
    hardMode
}