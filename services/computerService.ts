import { Game } from "../types/types";
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

  const availableMoves = gameService.getAvailableMoves(game);
  let bestMove = -1;
  let bestScore = -1;
  for(const move of availableMoves){
    const updatedGame = playMove(move, game);
    const score = minimax(move, updatedGame); 
    if(score > bestScore){
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
    //TODO: update this later
}

const isGameOver = (move:number, game:Game):number | null => {
  if(gameService.hasCurrentPlayerHasWon(move, game)){
    const winner = game.playerData.find(player => player.turn === true)
    if(winner?.isComputer === true){
      return 1;
    }
     return -1;
  }
  else if(gameService.nobodyWins(game)){
    return 0
  }
  return null;
}

const minimax = (move:number, game:Game) => {
  const gameScore = isGameOver(move, game)
  if(gameScore !== null){
    return gameScore;
  }
  gameService.selectNextPlayer(game.playerData);
  const availableMoves = gameService.getAvailableMoves(game);
  let bestScore = -1;
  for(const move of availableMoves){
    const updatedGame = playMove(move, game);
    const score = minimax(move, updatedGame);
    if(score > bestScore){
      bestScore = score;
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
  }
  return gameCopy;
}

const hardMode = (game:Game): number => {
  game.difficulty;
  return -1;
    //TODO: update this later
}

export default {
    easyMode,
    mediumMode,
    hardMode
}