import { useState } from "react"

import Grid from "./components/Grid"
import gameServices from "./services/game"




const Game = ({width, height, player, minMoves}) => {
    const [computer, setComputer] = useState(null)
    const [playerData, setPlayerData] = useState({
        player: {
            symbol: player,
            turn: false, 
            moves: []},
        computer: {
            symbol: computer,
            turn: false, 
            moves: [],}
    })
    
    if(computer === null){
        const b = gameServices.createComputerPlayer([player])
        setComputer(b)
    }


    return (
        <>
        <Grid width={width} height={height} players={playerData}/>
        </>
    )
}

export default Game