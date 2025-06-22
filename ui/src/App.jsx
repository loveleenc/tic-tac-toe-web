import { useState } from 'react'
// import Setup from './components/GameScreen/Setup'
// import Game from './Game'
import MainScreen from './components/MainScreen'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import GameScreen from './components/GameScreen/GameScreen'
import LoginScreen from './components/LoginScreen/LoginScreen'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/main" element={<MainScreen />} />
        <Route path="/play" element={<GameScreen />}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
