import Setup from "../Setup/Setup.jsx";
import Game from "./Game.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import types from "../../types/types.js";
import CreateOrJoinGame from "../Setup/CreateOrJoinGame.jsx";
import Navigation from "../Common/Navigation.jsx";
import Togglable from "../Common/Togglable.jsx";

const GameScreen = () => {
  
  const navigate = useNavigate();

  const handleGameOver = () => {
    setWidth(0);
    setHeight(0);
    setPlayers(null);
    setWinMoves(3);
    setDisabledSquares(false);
    setGameType(types.GameType.SINGLEPLAYER);
    navigate("/");
  };

  const quitGame = () => {
    if (window.confirm("Do you want to quit the game?")) {
      handleGameOver();
    }
  };

  useEffect(() => {

  }, [submitted])

  return (
    <>
      <div
        style={{ overflowY: "scroll", overflowX: "hidden", maxHeight: "100vh" }}>
        <Navigation quitGame={quitGame} />
        <div className="setupContainer pixelFontStyle">
          <div className="formContainer form">
            <div>Create a new game or join an ongoing one?</div>
              <Togglable
                buttonLabel="Create new single/multi-player game"
                buttonClassName="pixelFontStyle difficultyNavButton">
                <Setup />
              </Togglable>
              <Togglable
                buttonLabel="Join ongoing game"
                buttonClassName="pixelFontStyle difficultyNavButton">
                <div>blah</div>
              </Togglable>
          </div>
        </div>
      </div>

      <Game
        width={width}
        height={height}
        players={players}
        minMoves={winMoves}
        disableSquares={disableSquares}
        handleGameOver={handleGameOver}
        gameType={gameType}
        difficulty={difficulty}
      />
    </>
  );
};

export default GameScreen;
