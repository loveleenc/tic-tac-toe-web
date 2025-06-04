const games = {}

export default function getGames() {
    return games
}

export function deleteAllGames(){
    Object.keys(games).forEach(game => delete games[game]);
}