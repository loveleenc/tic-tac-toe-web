import { useState } from "react"
import './../../styles/setup.css'
import Navigation from "../Common/Navigation"
import Common from "../Common/Common"
import types from "../../types/types"
import Difficulty from "./Difficulty"


const GameType = ({setGameType, setDifficulty}) => {
    const [isSinglePlayer, setIsSinglePlayer] = useState(true)
    const handleGameTypeSelect = (event) => {
        setGameType(event.target.value)
        if(event.target.value === types.GameType.MULTIPLAYER){
            setIsSinglePlayer(false);
        }
        else{
            setIsSinglePlayer(true);
        }

    }

    return (
        <>
            <label htmlFor="gameType">Single player or multiplayer: </label>
            <select defaultValue={types.GameType.SINGLEPLAYER} onChange={handleGameTypeSelect} className="formSelect" name="gameType">
                <option value={types.GameType.SINGLEPLAYER}>Single-player</option>
                <option value={types.GameType.MULTIPLAYER}>Multi-player</option>
            </select>
            <Common.FormInput text={`Enter player 1 symbol: `} fieldName={`player1`} type="text" />
            {isSinglePlayer && (<Difficulty setDifficulty={setDifficulty}/>)}
        </>
    )
}

const Notification = ({text}) => {
    if (text === null){
        return (<p style={{height: '16px'}}></p>)
    }

    return (<p>{text}</p>)
}

const Setup = ({setWidth, setHeight, setPlayers, setNeededConsecutiveMoves, setDisabledSquares, resetSetup, setGameType, setDifficulty, difficulty}) => {
    const [isSubmitted, setSubmitted] = useState(false)
    const [notf, setNotification] = useState(null)

    const quitGame = () => {
        if(window.confirm("Do you want to quit the game?")){
            resetSetup()
        }
    }

    const updateWidth = (value) => {
        setWidth(parseInt(value, 10))
    } 
    
    const updateHeight = (value) => {
        setHeight(parseInt(value, 10))
    }

    const updatePlayers = (values) => {
        setPlayers(values)
    }

    const updateNumberOfMovesNeededToWin = (value) => {
        setNeededConsecutiveMoves(parseInt(value, 10))
    }

    const updateDisablingSquares = (value) => {
        setDisabledSquares(value)
    }

    const allDataHasBeenEntered = (event) => {
        const players = new Array()
        players.push(event.target['player1'].value)
        // for (let i = 1; i <= numberOfPlayers; i++){
        //     players.push(event.target[`player${i}`].value)
        // }

        return event.target.inputWidth.value !== "" &&
            event.target.inputHeight.value !== "" &&
            event.target.moves.value !== "" &&
            players.reduce((a, c) => a && c !== "", true) && 
            ((event.target.gameType.value === types.GameType.SINGLEPLAYER && difficulty !== null) || event.target.gameType.value === types.GameType.MULTIPLAYER)
    }

    const onSubmit = (event) => {
        event.preventDefault()
        if (!allDataHasBeenEntered(event)){
            setNotification("Please enter data in all the fields")
            setTimeout (() => setNotification(null), 5000)
            return
        }
        updateWidth(event.target.inputWidth.value)
        updateHeight(event.target.inputHeight.value)
        const players = new Array()
        players.push(event.target['player1'].value)
        // for (let i = 1; i <= numberOfPlayers; i++){
        //     players.push(event.target[`player${i}`].value)
        // }
        updatePlayers(players)
        updateNumberOfMovesNeededToWin(event.target.moves.value)
        updateDisablingSquares(event.target.squaresDisabled.checked)
        setSubmitted(true)
    }

    if (isSubmitted){
        return (<></>)
    }

    return (
        <>
        <Navigation quitGame={quitGame}/>
        <div className="setupContainer pixelFontStyle">
            <Notification text={notf} />
            <div className="title">Setup Game</div>
            <div className="formContainer">
                <form onSubmit={onSubmit} className="form">
                    <Common.FormInput text="Enter width: " fieldName="inputWidth" type="number"/>
                    <Common.FormInput text="Enter height: " fieldName="inputHeight" type="number"/>
                    <Common.FormInput text="Number of moves needed to win: " fieldName="moves" type="number"/>
                    <Common.FormInput text="Disable random squares? " fieldName="squaresDisabled" type="checkbox" />
                    <GameType setGameType={setGameType} setDifficulty={setDifficulty}/>
                    <p><button type="submit" className="createGridButton">Create Grid</button></p>
                </form>
            </div>
            
        </div>
        </>
    )
}

export default Setup