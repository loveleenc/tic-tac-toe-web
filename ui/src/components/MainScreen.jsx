import "./../styles/mainScreen.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import About from "./MainScreen/About";
import Leaderboard from "./MainScreen/Leaderboard";
import GameScreen from "./GameScreen/GameScreen";
import { useState } from "react";
import Common from "./Common";

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
      <div style={showMenuWhenVisibleIsTrue} className="mainMenu">
        <div>
          <Link to="/play">
            <Common.NavigationButton
              text="play"
              buttonLocation={{ left: 0, right: 0, top: "50px", bottom: 0 }}
            />
            {/* <img className="mainMenuItem playButton navigationButton" src={PLAY_BUTTON_BROWN} /> */}
          </Link>
        </div>
        <div>
          <Common.NavigationButton
            text="about"
            onClickEventHandler={handleAboutButtonClick}
            buttonLocation={{ left: 0, right: 0, top: "50px", bottom: 0 }}
          />
          {/* <img
            onClick={handleAboutButtonClick}
            className="mainMenuItem aboutButton navigationButton"
            src="/assets/navigation/about.png"
            role="button"
          /> */}
        </div>
        <div>
          <Common.NavigationButton
            text="leaderboard"
            onClickEventHandler={handleLeaderboardButtonClick}
            buttonLocation={{ left: 0, right: 0, top: "50px", bottom: 0 }}
          />
        </div>
      </div>

      <div style={showAboutWhenVisibleIsTrue}>
        <About />
        <Common.NavigationButton
          text="back"
          onClickEventHandler={handleBackButtonClick}
        />
      </div>

      <div style={showScoreboardWhenVisibleIsTrue} className="">
        <Leaderboard />
        <Common.NavigationButton
          text="back"
          onClickEventHandler={handleBackButtonClick}
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
