import { useState } from "react"

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
        <form onSubmit={onSubmit}>
        <p>Enter width: <input name="inputWidth"/></p>
        Enter height: <input name="inputHeight"/>
        <p>Enter player symbol: <input name="player"/></p>
        <p>Minimum number of moves needed to win: <input name="moves" /></p>
        <p><button type="submit">Create Grid</button></p>
      </form>
    )
}

export default Setup