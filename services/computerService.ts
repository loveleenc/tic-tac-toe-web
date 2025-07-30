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
  if(gameService.hasCurrentPlayerHasWon(game)){
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

export default {
    easyMode,
    mediumMode,
    hardMode
}