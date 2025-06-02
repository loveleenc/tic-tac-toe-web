import axios from 'axios'

const baseUrl = '/game'

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
    return axios.patch(baseUrl, {id: move})
}

const restartGame = () => {
    return axios.put(baseUrl)
}

const deleteGame = () => {
    return axios.delete(baseUrl)
}

export default {
    createGame,
    restartGame,
    deleteGame,
    playMove
}
