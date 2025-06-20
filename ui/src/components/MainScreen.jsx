import "./../styles/mainScreen.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import About from "./MainScreen/About";
import Leaderboard from "./MainScreen/Leaderboard";
import GameScreen from "./GameScreen/GameScreen";
import Togglable from "./Togglable";

const PLAY_BUTTON_BROWN = "/assets/navigation/play.png";

const AboutButton = (toggleVisibility) => {
    return (<>
        <img onClick={toggleVisibility} className="aboutButton" src="/assets/navigation/about.png" />
    </>)
}

const Menu = () => {
  return (
    <div>
      <span>
        <Link to="/play">
          <img className="playButton" src="/assets/navigation/play.png" />
        </Link>
      </span>
      <span>
        <Togglable childElement1={AboutButton} childElement2={<About />} />
        {/* <Link to="/about">
          <img className="aboutButton" src="/assets/navigation/about.png" />
        </Link> */}
      </span>
      <span>
        <Link to="/leaderboard">
          <img
            className="leaderboardButton"
            src="/assets/navigation/leaderboard.png"
          />
        </Link>
      </span>
    </div>
  );
};

const T = (onClickFunction) => {
    return <><button onClick={onClickFunction}>show</button></>
} 

const MainScreen = () => {
  return (
    <div className="mainScreenBackground">
      <div className="gameTitle">
        <img src="/assets/mainScreen/ttt_title.gif" />
      </div>
      <Menu />
    </div>
  );
};

export default MainScreen;
