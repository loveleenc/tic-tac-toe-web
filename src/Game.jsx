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
        console.log("printing shit:", data[0].moves)
        console.log(data[0])
        data[0].moves.push(1)
        console.log(data[1])
        data[1].moves.push(7)

        console.log("data is:", data)
        setPlayerData(data)
    }


    return (
        <>
        <Grid width={width} height={height} players={playerData}/>
        </>
    )
}

export default Game