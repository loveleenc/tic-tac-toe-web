import { useState } from "react"
import './../styles/setup.css'


const SINGLE_PLAYER = 'single-player'
const MULTI_PLAYER = 'multi-player'

const FormInput = ({text, fieldName, type}) => {
    if (type === "number"){
        return (
            <p style={{fontWeight: "bold"}}>
                {text}<input type={type} className="formInput" name={fieldName} min="3"/>
            </p>
        )
    }

    return (
        <p style={{fontWeight: "bold"}}>
            {text}<input type={type} className="formInput" name={fieldName}/>
        </p>
    )
}


const GameType = () => {
    const [isSinglePlayer, setSinglePlayer] = useState(true)
    const [numberOfPlayers, setNumberOfPlayers] = useState(1)

    const handleGameTypeSelect = (event) => {
        if (event.target.value === SINGLE_PLAYER){
            setSinglePlayer(true)
            setNumberOfPlayers(1)
        }
        else if(event.target.value === MULTI_PLAYER){
            setSinglePlayer(false)
        }
    }

    const handlePlayerNumber = (event) =>{
        console.log(event.target.value)
        setNumberOfPlayers(parseInt(event.target.value, 10))
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
                (<p style={{fontWeight: 'bold'}}>Select the number of players: <input type="number" onChange={handlePlayerNumber} className="formInput" name="playerNumber" min="2"/>
                </p>)
            }
            {[...Array(numberOfPlayers).keys()].map(index => <FormInput text={`Enter player ${index+=1} symbol: `} fieldName={`player${index+=1}`} type="text" />)}
        </>
    )
}

const Setup = ({setWidth, setHeight, setPlayers, setNeededConsecutiveMoves, setDisabledSquares}) => {
    const [isSubmitted, setSubmitted] = useState(false)
    
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

    const onSubmit = (event) => {
        event.preventDefault()
        updateWidth(event.target.inputWidth.value)
        updateHeight(event.target.inputHeight.value)
        updatePlayers(event.target.player.value)
        updateNumberOfMovesNeededToWin(event.target.moves.value)
        updateDisablingSquares(event.target.squaresDisabled.checked)
        setSubmitted(true)
    }

    

    if (isSubmitted){
        return (<></>)
    }

    return (
        <div className="setupContainer">
            <div className="title">Setup Game</div>
            <div className="formContainer">
                <form onSubmit={onSubmit} className="form">
                    <FormInput text="Enter width: " fieldName="inputWidth" type="number"/>
                    <FormInput text="Enter height: " fieldName="inputHeight" type="number"/>
                    <FormInput text="Number of moves needed to win: " fieldName="moves" type="number"/>
                    <FormInput text="Disable random squares? " fieldName="squaresDisabled" type="checkbox" />
                    <GameType />
                    <p><button type="submit" className="createGridButton">Create Grid</button></p>
                </form>
            </div>
        </div>
    )
}

export default Setup