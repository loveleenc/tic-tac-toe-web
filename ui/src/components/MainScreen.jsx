import "./../styles/mainScreen.css";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import About from "./MainScreen/About";
import Leaderboard from "./MainScreen/Leaderboard";
import { useState } from "react";
import Common from "./Common";
import './../styles/leaderboard.css';
import './../styles/about.css';
import logoutAPI from "../services/logoutAPI";

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

  const navigate = useNavigate()

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

  

  const handleLogout = () => {
    logoutAPI.logout().then(() => {
      navigate('/')
    })
  }

  return (
    <>
      <div style={showMenuWhenVisibleIsTrue} className="mainMenu">
          <Link to="/play">
            <Common.NavigationButton
              text="play"
              buttonLocation={{ left: 0, right: 0, top: "25%", bottom: 0 }}
            />
          </Link>
          <Common.NavigationButton
            text="about"
            onClickEventHandler={handleAboutButtonClick}
            buttonLocation={{ left: 0, right: 0, top: "25%", bottom: 0 }}
          />
          <Common.NavigationButton
            text="leaderboard"
            onClickEventHandler={handleLeaderboardButtonClick}
            buttonLocation={{ left: 0, right: 0, top: "25%", bottom: 0 }}
          />
          <Common.NavigationButton
            text="logout"
            onClickEventHandler={handleLogout}
            buttonLocation={{ left: 0, right: 0, top: '25%', bottom: 0}}
          />
      </div>

      <div style={showAboutWhenVisibleIsTrue} className="aboutSection">
        <About />
        <Common.NavigationButton
          text="back"
          onClickEventHandler={handleBackButtonClick}
          buttonLocation={{ left: 0, right: 0, top: "10px", bottom: 0 }}
        />
      </div>

      <div style={showScoreboardWhenVisibleIsTrue} className="leaderboard">
        <Leaderboard />
        <Common.NavigationButton
          text="back"
          onClickEventHandler={handleBackButtonClick}
          buttonLocation={{ left: 0, right: 0, top: "10px", bottom: 0 }}
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
