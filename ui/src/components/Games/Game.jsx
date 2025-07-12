import { useState, useCallback, useEffect } from "react"
import gameAPI from "../../services/gameAPI.js"
import Square from "./Square.jsx"
import Navigation from '../Common/Navigation.jsx'
import './../../styles/game.css'


const Game = ({width, height, players, minMoves, disableSquares, handleGameOver, gameType, difficulty}) => {
    const [gridy, setGrid] = useState([])
    const [playerData, setPlayerData] = useState(null)
    const [gameOver, setGameOver] = useState(false)

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
            handleGameOver()
            
        }
    }, [gameOver])

    const quitGame = () => {
        if(window.confirm("Do you want to quit the game?")){
            gameAPI.deleteGame()
                .then(() => {
                    setPlayerData(null)
                    setGrid([])
                    handleGameOver()
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
    }, [width])
    
    if (width === 0 && height === 0 && players === null){
        return (<></>)
    }

    else if (playerData === null){
        gameAPI.createGame(players, width, height, minMoves, disableSquares, gameType, difficulty)
            .then(response => {
                setGrid(response.data.grid)
                index = response.data.grid.length * response.data.grid[0].length
                setPlayerData(response.data.playerData)
            })
        return (<></>)
    }
    
    return (
        <div className="gameBackground">
            <Navigation quitGame={quitGame} restartGame={restartGame}/>
            <p style={{position: 'absolute', top: '45px'}} className="pixelFontStyle">Current player: {playerData.find(p => p.turn === true).symbol}</p>
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
        </div>
    )
}

export default Game