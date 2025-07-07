import Setup from "./Setup";
import Game from "./Game.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import types from "../../types/types.js";
import Difficulty from "./Difficulty.jsx";

const GameScreen = () => {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [players, setPlayers] = useState(null)
    const [winMoves, setWinMoves] = useState(3)
    const [disableSquares, setDisabledSquares] = useState(false)
    const [gameType, setGameType] = useState('')
    const [difficulty, setDifficulty] = useState(null)
    const navigate = useNavigate()
    
    const handleGameOver = () =>{
        setWidth(0)
        setHeight(0)
        setPlayers(null)
        setWinMoves(3)
        setDisabledSquares(false)
        setGameType(types.GameType.SINGLEPLAYER)
        navigate('/')
    }

    return (
        <>
        {/* <Setup setWidth={setWidth} setHeight={setHeight} setPlayers={setPlayers} setNeededConsecutiveMoves={setWinMoves} 
                      setDisabledSquares={setDisabledSquares} resetSetup={handleGameOver} setGameType={setGameType}
                      setDifficulty={setDifficulty}
                      /> */}
        <Difficulty setDifficulty={setDifficulty}/>
        <Game width={width} height={height} players={players} minMoves={winMoves} disableSquares={disableSquares} handleGameOver={handleGameOver}
                gameType={gameType}/>
        </>
    )
}

export default GameScreen