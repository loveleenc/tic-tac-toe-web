import { useState } from "react"
import './../styles/setup.css'


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

const Setup = ({setWidth, setHeight, setPlayer, setNeededConsecutiveMoves}) => {
    const [isSubmitted, setSubmitted] = useState(false)

    const updateWidth = (value) => {
        setWidth(parseInt(value, 10))
    } 
    
    const updateHeight = (value) => {
        setHeight(parseInt(value, 10))
    }

    const updatePlayer = (value) => {
        setPlayer(value)
    }

    const updateNumberOfMovesNeededToWin = (value) => {
        setNeededConsecutiveMoves(parseInt(value, 10))
    }

    const onSubmit = (event) => {
        event.preventDefault()
        updateWidth(event.target.inputWidth.value)
        updateHeight(event.target.inputHeight.value)
        updatePlayer(event.target.player.value)
        updateNumberOfMovesNeededToWin(event.target.moves.value)
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
                    <FormInput text="Enter player symbol: " fieldName="player" type="text"/>
                    <FormInput text="Number of moves needed to win: " fieldName="moves" type="number"/>
                    <p><button type="submit" className="createGridButton">Create Grid</button></p>
                </form>
            </div>
        </div>
    )
}

export default Setup