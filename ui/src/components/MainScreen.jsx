import './../styles/mainScreen.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import About from './MainScreen/About'
import Leaderboard from './MainScreen/Leaderboard'

const PLAY_BUTTON_BROWN = '/assets/navigation/play.png'

const PlayButton = ({handlePlayButtonClick}) => {
    const onMouseOverPlayButton = (event, b) =>{
        event.target.src = b
    }
    return(
        <div>
        <img id="boo" className="playButton" src={PLAY_BUTTON_BROWN}
                        // onMouseOver={() => onMouseOverPlayButton(event, PLAY_BUTTON_HIGHLIGHTED)}
                        // onMouseOut={() => onMouseOverPlayButton(event, PLAY_BUTTON_GREEN)}
                        onClick={handlePlayButtonClick}/>
        </div>
    )
}



const MainScreen = ({handlePlayButtonClick}) => {

    const onMouseOverPlayButton = (event, b) =>{
        event.target.src = b
    }
    return(
        <div className="mainScreenBackground">
        <Router>
            <div className="gameTitle">
                <img src='/assets/mainScreen/ttt_title.gif' />
            </div>
            
            <Routes>
                <Route path="/play" element={null}/>
                <Route path="/scoreboard" element={null}/>
                <Route path="/about" element={<About />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
            <div>
                <span><Link to="/play"><PlayButton handlePlayButtonClick={handlePlayButtonClick} /></Link></span>
                <span><Link to="/about"><img className="aboutButton" src="/assets/navigation/about.png" /></Link></span>
                <span><Link to="/leaderboard"><img className="leaderboardButton" src="/assets/navigation/leaderboard.png" /></Link></span>
            </div>
            
            
            
        </Router>
        </div>)
}

export default MainScreen

