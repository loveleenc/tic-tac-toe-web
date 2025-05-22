import { useState } from 'react'
import Setup from './components/Setup'
import Game from './Game'
import MainScreen from './components/MainScreen'
import Navigation from './components/Navigation'

function App() {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [player, setPlayer] = useState(null)
  const [winMoves, setWinMoves] = useState(3)
  const [playGame, setPlayGame] = useState(false)

  const handleGameOver = () =>{
    setPlayGame(false)
    setWidth(0)
    setHeight(0)
    setPlayer(null)
    setWinMoves(3)
  }

  const startGame = () => {
    setPlayGame(true)
  }

  const stopGame = () => {
    if (!window.confirm(`Game over! Do you want to go back?`)){
      return
    }
    setPlayGame(false)
  }

  if (!playGame){
    return (
      <MainScreen handlePlayButtonClick={startGame}/>
    )
  }

  return (
    <>
      {/* <button onClick={handleQuitGame}>Quit</button > */}
      <Navigation />
      <Setup setWidth={setWidth} setHeight={setHeight} setPlayer={setPlayer} setNeededConsecutiveMoves={setWinMoves}/>
      <Game width={width} height={height} player={player} minMoves={winMoves} handleGameOver={handleGameOver}/>
    </>
  )
}

export default App
