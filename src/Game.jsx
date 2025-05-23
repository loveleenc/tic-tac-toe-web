import { useState, useCallback, useEffect } from "react"
import gameServices from "./services/game"
import Square from "./components/Square"
import Navigation from './components/Navigation'
import './styles/game.css'

const Game = ({width, height, player, minMoves, disableSquares, handleGameOver}) => {
    const [playerData, setPlayerData] = useState(null)
    const [gameOver, setGameOver] = useState(false)
    const [disabledSquares, setDisabledSquares] = useState([])
    let grid;
    let index;

    const updateGame = (id) => {
        setPlayerData(playerData => {
            let newPlayerData = gameServices.updateMoveInPlayerData(playerData, id)

            if(gameServices.hasCurrentPlayerHasWon(id, minMoves, width, height, newPlayerData)){
                alert(`Game over! Player ${newPlayerData.find(player => player.turn === true).symbol} has won!`)
                setGameOver(true)
            }
            else if (gameServices.nobodyWins(newPlayerData, width, height, disabledSquares)){
                alert("Nobody wins :(")
                setGameOver(true)
            }
            else{
                gameServices.selectNextPlayer(newPlayerData)
            }
            return newPlayerData
        })
    }

    useEffect(() => {
        if (gameOver){
            setPlayerData(null)
            setDisabledSquares([])
            handleGameOver()
        }
    }, [gameOver])

    const quitGame = () => {
        if(window.confirm("Do you want to quit the game?")){
            setPlayerData(null)
            setDisabledSquares([])
            handleGameOver()
        }
    }

    const restartGame = () => {
        if(window.confirm("Do you want to restart the game?")){
            const players = new Array()
            players.push(player)
            const data = gameServices.createInitialPlayerData(players)
            setPlayerData(data)
        }
    }

    const getSquareId = useCallback((id) => {
        const int_id = parseInt(id, 10)
        updateGame(int_id)
    }, [width, disabledSquares])
    
    if (width === 0 && height === 0 && player === null){
        return (<></>)
    }
    else if (playerData === null){
        const players = new Array()
        players.push(player)
        const data = gameServices.createInitialPlayerData(players)
        if (disableSquares){
            const squares = gameServices.selectSquaresToDisable(width, height)
            setDisabledSquares(squares)
        }
        setPlayerData(data)
        return (<></>)
    }
    
    grid = gameServices.createGridArray(width, height, playerData, disabledSquares)
    index = grid.length * grid[0].length


    return (
        <div className="gameBackground">
            <Navigation quitGame={quitGame} restartGame={restartGame}/>
            <div className="grid">
                {grid.map((row, i) => {
                    let squares = row.map(s => <Square id={s.count} key={s.count} getSquareId={getSquareId} text={s.text} />)
                    if (i + 1 < grid.length){
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