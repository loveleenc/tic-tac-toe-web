import "./../styles/mainScreen.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import About from "./MainScreen/About";
import Leaderboard from "./MainScreen/Leaderboard";
import GameScreen from "./GameScreen/GameScreen";
import { useState } from "react";

const PLAY_BUTTON_BROWN = "/assets/navigation/play.png";

const Menu = () => {
  const [visible, setVisible] = useState(true);
  const showMenuWhenVisibleIsTrue = { display: visible ? "" : "none" };

  const [visibleAbout, setVisibleAbout] = useState(false);
  const showAboutWhenVisibleIsTrue = { display: visibleAbout ? "" : "none" };

  const [visibleScoreboard, setVisibleScoreboard] = useState(false);
  const showScoreboardWhenVisibleIsTrue = {
    display: visibleScoreboard ? "" : "none",
  };

  const handleAboutButtonClick = () => {
    setVisible(false);
    setVisibleAbout(true);
  };

  const handleLeaderboardButtonClick = () => {
    setVisible(false);
    setVisibleScoreboard(true);
  };

  const handleBackButtonClick = () => {
    setVisible(true);
    setVisibleAbout(false);
    setVisibleScoreboard(false);
  };

  return (
    <>
      <div style={showMenuWhenVisibleIsTrue}>
        <div>
          <Link to="/play">
            <img className="mainMenuItem playButton navigationButton" src={PLAY_BUTTON_BROWN} />
          </Link>
        </div>
        <div>
          <img
            onClick={handleAboutButtonClick}
            className="mainMenuItem aboutButton navigationButton"
            src="/assets/navigation/about.png"
            role="button"
          />
        </div>
        <div>
          <img
            onClick={handleLeaderboardButtonClick}
            className="mainMenuItem leaderboardButton navigationButton"
            src="/assets/navigation/leaderboard.png"
            role="button"
          />
        </div>
      </div>

      <div style={showAboutWhenVisibleIsTrue}>
        <About />
        <img
          onClick={handleBackButtonClick}
          className="backButton navigationButton"
          src="/assets/navigation/back.png"
          role="button"
        />
      </div>

      <div style={showScoreboardWhenVisibleIsTrue}>
        <Leaderboard />
        <img
          onClick={handleBackButtonClick}
          className="backButton navigationButton"
          src="/assets/navigation/back.png"
          role="button"
        />
      </div>
    </>
  );
};

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
