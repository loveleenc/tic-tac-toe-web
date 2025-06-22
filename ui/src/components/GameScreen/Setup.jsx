import { useState } from "react"
import './../../styles/setup.css'
import Navigation from "../Navigation"
import Common from "../Common"

const SINGLE_PLAYER = 'single-player'
const MULTI_PLAYER = 'multi-player'



const GameType = ({numberOfPlayers, setNumberOfPlayers}) => {
    const [isSinglePlayer, setSinglePlayer] = useState(true)
    

    const handleGameTypeSelect = (event) => {
        if (event.target.value === SINGLE_PLAYER){
            setSinglePlayer(true)
            setNumberOfPlayers(1)
        }
        else if(event.target.value === MULTI_PLAYER){
            setSinglePlayer(false)
            setNumberOfPlayers(2)
        }
    }

    const handlePlayerNumber = (event) =>{
        let value = event.target.value
        if(value === ""){
            value = 2
        }
        setNumberOfPlayers(parseInt(value, 10))
    }

    return (
        <>
            <label htmlFor="gameType" style={{fontWeight: "bold"}}>Single player or multiplayer: </label>
            <select defaultValue={isSinglePlayer === true ? SINGLE_PLAYER : MULTI_PLAYER} onChange={handleGameTypeSelect} className="formSelect" name="gameType">
                <option value={SINGLE_PLAYER}>Single-player</option>
                <option value={MULTI_PLAYER}>Multi-player</option>
            </select>
            {
                !isSinglePlayer && 
                (<p style={{fontWeight: 'bold'}}>Select the number of players: <input defaultValue={numberOfPlayers} type="number" onChange={handlePlayerNumber} className="formInput" onWheel={(event) => event.target.blur()} name="playerNumber" min="2"/>
                </p>)
            }
            {[...Array(numberOfPlayers).keys()].map(index => <Common.FormInput key={index} text={`Enter player ${index+=1} symbol: `} fieldName={`player${index}`} type="text" />)}
        </>
    )
}

const Notification = ({text}) => {
    if (text === null){
        return (<p></p>)
    }

    return (<p>{text}</p>)
}

const Setup = ({setWidth, setHeight, setPlayers, setNeededConsecutiveMoves, setDisabledSquares, resetSetup}) => {
    const [isSubmitted, setSubmitted] = useState(false)
    const [numberOfPlayers, setNumberOfPlayers] = useState(1)
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
        for (let i = 1; i <= numberOfPlayers; i++){
            players.push(event.target[`player${i}`].value)
        }

        return event.target.inputWidth.value !== "" &&
            event.target.inputHeight.value !== "" &&
            event.target.moves.value !== "" &&
            players.reduce((a, c) => a && c !== "", true)
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
        for (let i = 1; i <= numberOfPlayers; i++){
            players.push(event.target[`player${i}`].value)
        }
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
        <div className="setupContainer">
            <Notification text={notf} />
            <div className="title">Setup Game</div>
            <div className="formContainer">
                <form onSubmit={onSubmit} className="form">
                    <Common.FormInput text="Enter width: " fieldName="inputWidth" type="number"/>
                    <Common.FormInput text="Enter height: " fieldName="inputHeight" type="number"/>
                    <Common.FormInput text="Number of moves needed to win: " fieldName="moves" type="number"/>
                    <Common.FormInput text="Disable random squares? " fieldName="squaresDisabled" type="checkbox" />
                    <GameType numberOfPlayers={numberOfPlayers} setNumberOfPlayers={setNumberOfPlayers}/>
                    <p><button type="submit" className="createGridButton">Create Grid</button></p>
                </form>
            </div>
        </div>
        </>
    )
}

export default Setup