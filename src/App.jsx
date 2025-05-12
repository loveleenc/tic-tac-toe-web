import { useState } from 'react'
import Setup from './components/Setup'
import Game from './Game'
import MainScreen from './components/MainScreen'

function App() {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [player, setPlayer] = useState(null)
  const [winMoves, setWinMoves] = useState(3)
  const [gameOver, setGameOver] = useState(true)
  const [playGame, setPlayGame] = useState(false)


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
      <Setup setWidth={setWidth} setHeight={setHeight} setPlayer={setPlayer} setNeededConsecutiveMoves={setWinMoves}/>
      <Game width={width} height={height} player={player} minMoves={winMoves} gameOver={gameOver}/>
    </>
  )
}

export default App
