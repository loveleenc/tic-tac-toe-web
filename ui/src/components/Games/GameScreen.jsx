import Setup from "../Setup/Setup.jsx";
import Game from "./Game.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import types from "../../types/types.js";
import CreateOrJoinGame from "../Setup/CreateOrJoinGame.jsx";

const GameScreen = () => {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [players, setPlayers] = useState(null)
    const [winMoves, setWinMoves] = useState(3)
    const [disableSquares, setDisabledSquares] = useState(false)
    const [gameType, setGameType] = useState(types.GameType.SINGLEPLAYER)
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
        <CreateOrJoinGame />
        <Setup setWidth={setWidth} setHeight={setHeight} setPlayers={setPlayers} setNeededConsecutiveMoves={setWinMoves} 
                      setDisabledSquares={setDisabledSquares} resetSetup={handleGameOver} setGameType={setGameType}
                      setDifficulty={setDifficulty} difficulty={difficulty}
                      />
        <Game width={width} height={height} players={players} minMoves={winMoves} disableSquares={disableSquares} handleGameOver={handleGameOver}
                gameType={gameType} difficulty={difficulty}/>
        </>
    )
}

export default GameScreen