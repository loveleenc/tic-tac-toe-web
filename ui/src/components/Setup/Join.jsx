import { useEffect, useState } from "react";
import Common from "../Common/Common"
import game from "../../utils/game";
import { useNavigate } from "react-router-dom";
import types from "../../types/types";

const Notification = ({ text }) => {
  if (text === null) {
    return <p style={{ height: "16px" }}></p>;
  }

  return <p>{text}</p>;
};

const JoinGame = () => {
    const [notf, setNotification] = useState(null);
    const [gameId, setGameId] = useState("");
    const [playerSymbol, setPlayerSymbol] = useState("");
    const [isSubmitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const allDataHasBeenEnteredCorrectly = (event) => {
        return (
            game.validateGameIdFormat(event.target.gameId.value) &&
            event.target.playerSymbol.value !== "" &&
            event.target.playerSymbol.value.length === 1
        )

    }
    const onSubmit = (event) => {
        event.preventDefault();
        if(!allDataHasBeenEnteredCorrectly(event)){
            setNotification("Please ensure all the data entered in the fields is correct");
            setTimeout(() => setNotification(null), 5000);
            return;
        }
        
        setGameId(event.target.gameId.value);
        setPlayerSymbol(event.target.playerSymbol.value);
        setSubmitted(true);
    }

    useEffect(() => {
        if(isSubmitted){
            navigate(`/gamemulti/${types.MultiplayerGameTypes.JOIN}`, {
                      state: {
                        gameId: gameId,
                        playerSymbol: playerSymbol,
                      },
                    });
        }
    }, [isSubmitted])


    return (
        <>
            <Notification text={notf} />
            <div className="title">Join Game</div>
            <div className="formContainer">
            <form onSubmit={onSubmit} className="form">
                <Common.FormInput
                text="Enter game ID: "
                fieldName="gameId"
                type="text"
                />
                <Common.FormInput
                text="Enter player symbol: "
                fieldName="playerSymbol"
                type="text"
                />
                <p>
                <button type="submit" className="createGridButton">
                    Join
                </button>
                </p>
            </form>
            </div>
        </>
    )
}

export default JoinGame