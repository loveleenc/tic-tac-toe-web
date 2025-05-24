import axios from 'axios'

const baseUrl = 'http://localhost:3001/game'

const createGame = (players, width, height, minMoves, disableSquares) => {
    const gameData = {
        players: players,
        width: width,
        height: height,
        minMoves: minMoves,
        disableSquares: disableSquares
    }
    return axios.post(baseUrl, gameData)
}

const playMove = (move) => {

}

export default {
    createGame
}
