import { useState } from 'react'
// import Setup from './components/GameScreen/Setup'
// import Game from './Game'
import MainScreen from './components/MainScreen'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import GameScreen from './components/GameScreen/GameScreen'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/play" element={<GameScreen />}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
