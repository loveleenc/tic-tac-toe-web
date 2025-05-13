import { useState } from "react"

import Grid from "./components/Grid"
import gameServices from "./services/game"


const Game = ({width, height, player, minMoves}) => {
    const [playerData, setPlayerData] = useState(null)

    if (width === 0 && height === 0 && player === null){
        return (<></>)
    }
    if(playerData === null){
        const players = new Array()
        players.push(player)
        const data = gameServices.createInitialPlayerData(players)
        setPlayerData(data)
    }

    const getSquareId = (id) => {
        const newPlayerData = gameServices.updateMoveInPlayerData(playerData, id)
        setPlayerData(newPlayerData)
    }

    return (
        <>
            <Grid width={width} height={height} players={playerData} getSquareId={getSquareId}/>
        </>
    )
}

export default Game