import { useState, useCallback, useEffect, useRef } from "react"
import gameAPI from "../../services/gameAPI.js"
import Navigation from '../Common/Navigation.jsx'
import './../../styles/game.css'
import { useLocation, useNavigate } from "react-router-dom"
import Common from "../Common/Common.jsx"
import Grid from "./Grid.jsx"
import game from "../../utils/game.js"

const GameMultiPlayer = () => {
    const GAME_ID_MESSAGE = "Please share below game room id with other players to join the game:" 
    const {state} = useLocation(); 
    const navigate = useNavigate();

    const [grid, setGrid] = useState([])
    const [playerData, setPlayerData] = useState(null)
    const [gameOver, setGameOver] = useState(false)
    
    const [gameIdMessage, setGameIdMessage] = useState("")  
    const dialogRef = useRef(null);

    //multiplayer only stuff: 1. bottom left message if new player joined/left, 2. whose turn it is, 3. timer displayed in top right corner

    useEffect(() => {   
        if(gameIdMessage !== ""){
            dialogRef.current.showModal()
        }
    }, [gameIdMessage])

    const updateGame = (id) => {                          
        gameAPI.playMove(id)      
                .then(response => {
                    const game = response.data
                    if(game.status === 'END' && game.winner !== null){
                        alert(`Game over! Player ${game.winner} has won!`)
                        setGameOver(true)
                    }
                    else if(game.status === 'END' && game.winner === null){
                        alert("Nobody wins :(")
                        setGameOver(true)
                    }
                    else{
                        setGrid(game.grid)
                        setPlayerData(game.playerData)
                    }
                })
    }

    const getSquareId = useCallback((id) => {   
        const int_id = parseInt(id, 10)
        updateGame(int_id)
    }, [state.width])


    useEffect(() => {   
        if (gameOver){
            setTimeout(() => {
                navigate("/")
            }, 3000)
            
        }
    }, [gameOver])

    if (playerData === null){
        gameAPI.createGame(state.players, state.width, state.height, state.minMoves, state.disableSquares, state.gameType, state.difficulty)
            .then(response => {
                setGrid(response.data.grid)
                setPlayerData(response.data.playerData)
                setGameIdMessage(`${GAME_ID_MESSAGE}\n${game.getGameId()}`);
            })
        return (<></>)
    }

    return (
        <>
            <div className="gameBackground gameBackgroundHeightMultiplayer">
                <Grid grid={grid} getSquareId={getSquareId} />
                <Navigation style={{position: 'fixed', top: 0}}/>
                <Common.MessageDialog dialogRef={dialogRef} message={gameIdMessage}/>
                <p style={{left: '5px', bottom: '15px', position: 'absolute', padding: '5px'}} className="pixelFontStyle">player updates go here blah blah blah</p>
                <CurrentPlayerTimer seconds="5" />
            </div>
            <div className="gameStatusWindow">
            <Common.CurrentPlayer playerData={playerData} />
            </div>
        </>
        
    )
}


const CurrentPlayerTimer = ({seconds}) => {
    return (
        <>
            <p style={{top: '45px', position: 'absolute', right: '25px'}} className="pixelFontStyle">Time left: {seconds}s</p>
        </>
    )
}

export default GameMultiPlayer