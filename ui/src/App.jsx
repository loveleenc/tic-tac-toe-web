import MainScreen from './components/Main/MainScreen'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import GameScreen from './components/Games/GameScreen'
import LoginScreen from './components/Login/LoginScreen'
import ActivateAccount from './components/AccountManagement/Activate'
import ResetAccount from './components/AccountManagement/Reset'
import GameSinglePlayer from './components/Games/GameSinglePlayer'
import GameMultiPlayer from './components/Games/GameMultiPlayer'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/main" element={<MainScreen/>} />
        <Route path="/setup" element={<GameScreen />}/>
        <Route path="/gamesingle" element={<GameSinglePlayer />}/>
        <Route path="/gamemulti" element={<GameMultiPlayer />}/>
        <Route path="/account/verify/:id" element={<ActivateAccount />} />
        <Route path="/account/reset/:id" element={<ResetAccount />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
