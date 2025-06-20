import { useState } from 'react'
// import Setup from './components/GameScreen/Setup'
// import Game from './Game'
import MainScreen from './components/MainScreen'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import GameScreen from './components/GameScreen/GameScreen'
import About from './components/MainScreen/About'
import Leaderboard from './components/MainScreen/Leaderboard'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/play" element={<GameScreen />}/>
        <Route path="/about" element={<About />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
