import { useState, useCallback, useEffect } from "react"
import gameAPI from "../../services/gameAPI.js"
import Navigation from '../Common/Navigation.jsx'
import './../../styles/game.css'
import { useLocation, useNavigate } from "react-router-dom"
import Common from "../Common/Common.jsx"
import LoadingScreen from "./LoadingScreen.jsx"
import Grid from "./Grid.jsx"


const GameSinglePlayer = () => {
    const {state} = useLocation(); 
    const navigate = useNavigate();

    const [grid, setGrid] = useState([])
    const [playerData, setPlayerData] = useState(null)
    const [gameOver, setGameOver] = useState(false)
    const [displayLoadingDialog, setLoadingDialogOnDisplay] = useState(false)


    const quitGame = () => {    
        if(window.confirm("Do you want to quit the game?")){
            gameAPI.deleteGame()
                .then(() => {
                    navigate("/")
                })
        }
    }

    const restartGame = () => { 
        if(window.confirm("Do you want to restart the game?")){
            gameAPI.restartGame()
                .then(response => {
                    setPlayerData(response.data.playerData)
                    setGrid(response.data.grid)
                })
        }
    }

    const updateGame = (id) => {                         
        setLoadingDialogOnDisplay(true);
        gameAPI.playMove(id) 
                .then(response => {
                    setLoadingDialogOnDisplay(false);
                    const game = response.data
                    setGrid(game.grid)
                    setPlayerData(game.playerData)
                    if(game.status === 'END' && game.winner !== null){
                        alert(`Game over! Player ${game.winner} has won!`)
                        setGameOver(true)
                    }
                    else if(game.status === 'END' && game.winner === null){
                        alert("Nobody wins :(")
                        setGameOver(true)
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
            })
        return (<></>)
    }

    return (   
        <div className="gameBackground gameBackgroundHeightSingleplayer">
            <Grid grid={grid} getSquareId={getSquareId} />
            <Navigation buttons={[
                {text: 'Quit', action: quitGame},
                {text: 'Restart', action: restartGame}
            ]} quitGame={quitGame} restartGame={restartGame} style={{position: 'fixed', top: 0}}/>
            <Common.CurrentPlayer playerData={playerData} />
            <LoadingScreen message="Computer is playing..." display={displayLoadingDialog} />
        </div>
    )
}


export default GameSinglePlayer