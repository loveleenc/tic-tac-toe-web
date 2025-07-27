import { useState, useCallback, useEffect, useRef } from "react"
import gameAPI from "../../services/gameAPI.js"
import Square from "./Square.jsx"
import Navigation from '../Common/Navigation.jsx'
import './../../styles/game.css'
import { useLocation, useNavigate } from "react-router-dom"
import Common from "../Common/Common.jsx"
import types from "../../types/types.js"

const GAME_ID_MESSAGE = "Please share below game room id with other players to join the game:"
const Game = () => {
    const {state} = useLocation(); 
    const navigate = useNavigate();

    const [gridy, setGrid] = useState([])
    const [playerData, setPlayerData] = useState(null)
    const [gameOver, setGameOver] = useState(false)
    const [gameIdMessage, setGameIdMessage] = useState("")
    const dialogRef = useRef(null);
    let index;

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

    useEffect(() => {
        if (gameOver){
            setPlayerData(null)
            setGrid([])
            navigate("/")
        }
    }, [gameOver])

    useEffect(() => {
        if(gameIdMessage !== ""){
            dialogRef.current.showModal()
        }
    }, [gameIdMessage])

    const quitGame = () => {
        if(window.confirm("Do you want to quit the game?")){
            gameAPI.deleteGame()
                .then(() => {
                    setPlayerData(null)
                    setGrid([])
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

    const getSquareId = useCallback((id) => {
        const int_id = parseInt(id, 10)
        updateGame(int_id)
    }, [state.width])

    const getGameId = () => {
        const regex = "gameId=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
        const foundCookies = document.cookie.match(regex)
        if(!foundCookies){
            return ""
        }
        return foundCookies[0].split("gameId=")[1];
    }

    if (state.width === 0 && state.height === 0 && state.players === null){
        return (<></>)
    }

    else if (playerData === null){
        gameAPI.createGame(state.players, state.width, state.height, state.minMoves, state.disableSquares, state.gameType, state.difficulty)
            .then(response => {
                setGrid(response.data.grid)
                index = response.data.grid.length * response.data.grid[0].length
                setPlayerData(response.data.playerData)
                state.gameType === types.GameType.MULTIPLAYER ? setGameIdMessage(`${GAME_ID_MESSAGE}\n${getGameId()}`) : "";
            })
        return (<></>)
    }

    return (
        <div className="gameBackground">
            <div className="grid">
                {gridy.map((row, i) => {
                    let squares = row.map(s => <Square id={s.count} key={s.count} getSquareId={getSquareId} text={s.text} />)
                    if (i + 1 < gridy.length){
                        squares.push(<br key={index}/>)
                        index +=1
                    }
                    return squares
                })}
            </div>
            <Navigation quitGame={quitGame} restartGame={restartGame} style={{position: 'fixed', top: 0}}/>
            <CurrentPlayer playerData={playerData} />
            <Common.MessageDialog dialogRef={dialogRef} message={gameIdMessage}/>
        </div>
    )
}

const CurrentPlayer = ({playerData}) => {

    if(playerData.length > 1){
        return (
            <>
                <p style={{position: 'absolute', top: '45px'}} className="pixelFontStyle">Current player: {playerData.find(p => p.turn === true).symbol}</p>
            </>
        )
    }
    return (
        <div className="darkBackground">
          <div className="loadingScreen pixelFontStyle">
            Waiting for other players to join...
          </div>
      </div>
    )

}


export default Game