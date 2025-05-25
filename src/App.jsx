import { useState } from 'react'
import Setup from './components/Setup'
import Game from './Game'
import MainScreen from './components/MainScreen'

function App() {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [players, setPlayers] = useState(null)
  const [winMoves, setWinMoves] = useState(3)
  const [playGame, setPlayGame] = useState(false)
  const [disableSquares, setDisabledSquares] = useState(false)
  
  const handleGameOver = () =>{
    setPlayGame(false)
    setWidth(0)
    setHeight(0)
    setPlayer(null)
    setWinMoves(3)
    setDisabledSquares(false)
  }

  const startGame = () => {
    setPlayGame(true)
  }

  if (!playGame){
    return (
      <MainScreen handlePlayButtonClick={startGame}/>
    )
  }

  return (
    <>
      <Setup setWidth={setWidth} setHeight={setHeight} setPlayer={setPlayers} setNeededConsecutiveMoves={setWinMoves} 
              setDisabledSquares={setDisabledSquares}/>
      <Game width={width} height={height} players={players} minMoves={winMoves} disableSquares={disableSquares} handleGameOver={handleGameOver}/>
    </>
  )
}

export default App
