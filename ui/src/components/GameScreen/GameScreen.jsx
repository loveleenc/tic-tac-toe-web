import Setup from "./Setup";
import Game from "./Game.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GameScreen = () => {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [players, setPlayers] = useState(null)
    const [winMoves, setWinMoves] = useState(3)
    const [disableSquares, setDisabledSquares] = useState(false)
    const navigate = useNavigate()
    
    const handleGameOver = () =>{
        setWidth(0)
        setHeight(0)
        setPlayers(null)
        setWinMoves(3)
        setDisabledSquares(false)
        navigate('/')
    }

    return (
        <>
        <Setup setWidth={setWidth} setHeight={setHeight} setPlayers={setPlayers} setNeededConsecutiveMoves={setWinMoves} 
                      setDisabledSquares={setDisabledSquares} resetSetup={handleGameOver}/>
        <Game width={width} height={height} players={players} minMoves={winMoves} disableSquares={disableSquares} handleGameOver={handleGameOver}/>
        </>
    )
}

export default GameScreen