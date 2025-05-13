import { useState } from "react"
import Grid from "./components/Grid"
import gameServices from "./services/game"

const Game = ({width, height, player, minMoves, stopGame}) => {
    const [playerData, setPlayerData] = useState(null)
    const x_coordinates = []
    const y_coordinates = []
    let grid;

    if (width === 0 && height === 0 && player === null){
        return (<></>)
    }

    if(playerData === null){
        const players = new Array()
        players.push(player)
        const data = gameServices.createInitialPlayerData(players)
        setPlayerData(data)
    }
    else{
        grid = gameServices.createGridArray(width, height, playerData, x_coordinates, y_coordinates)
    }

    const getSquareId = (id) => {
        id = parseInt(id, 10)
        const newPlayerData = gameServices.updateMoveInPlayerData(playerData, id)
        if(gameServices.hasCurrentPlayerHasWon(id, minMoves, width, height, playerData)){
            stopGame()
        }
        else{
            gameServices.selectNextPlayer(newPlayerData)
            setPlayerData(newPlayerData)
        }
    }

    return (
        <>
        <Grid gridArray={grid} getSquareId={getSquareId}/>
        </>
    )
}

export default Game