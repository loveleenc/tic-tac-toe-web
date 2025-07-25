import MainScreen from './components/Main/MainScreen'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import GameScreen from './components/Games/GameScreen'
import LoginScreen from './components/Login/LoginScreen'
import Game from './components/Games/Game'
import ActivateAccount from './components/AccountManagement/Activate'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/main" element={<MainScreen/>} />
        <Route path="/setup" element={<GameScreen />}/>
        <Route path="/game" element={<Game />}/>
        <Route path="/account/verify/:id" element={<ActivateAccount />} />
        <Route path="/account/reset/:id" element={<div>reset blah</div>} />
      </Routes>
    </Router>
    </>
  )
}

export default App
