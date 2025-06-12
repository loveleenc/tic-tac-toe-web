import { Games } from "../types/types";

const games:Games = {}

export default function getGames():Games {
    return games
}

export function deleteAllGames(){
    Object.keys(games).forEach(game => delete games[game]);
}