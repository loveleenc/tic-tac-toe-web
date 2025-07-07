import { Game } from "../types/types";


const easyMode = (game: Game):number => {
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
}

const mediumMode = (game:Game): number => {
    return -1;
    //TODO: update this later
}

const hardMode = (game:Game): number => {
    return -1;
    //TODO: update this later
}

export default {
    easyMode,
    mediumMode,
    hardMode
}