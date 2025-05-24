import { useState, useCallback, useEffect } from "react"
import gameServices from "./services/game"
import gameAPI from "./services/gameAPI"
import Square from "./components/Square"
import Navigation from './components/Navigation'
import './styles/game.css'

const Game = ({width, height, player, minMoves, disableSquares, handleGameOver}) => {
    const [gridy, setGrid] = useState([])
    const [playerData, setPlayerData] = useState(null)
    const [gameOver, setGameOver] = useState(false)
    const [disabledSquares, setDisabledSquares] = useState([])
    let index;

    const updateGame = (id) => {    
        setPlayerData(playerData => {   //TODO: fix this convoluted bullshit
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
                if(newPlayerData.find(p => p.turn === true && p.isComputer === true)){
                    const id = gameServices.playAsComputer(playerData, disabledSquares, "easy", width, height)
                    newPlayerData = gameServices.updateMoveInPlayerData(newPlayerData, id)
                    if(gameServices.hasCurrentPlayerHasWon(id, minMoves, width, height, newPlayerData)){
                        alert(`Game over! Player ${newPlayerData.find(player => player.turn === true).symbol} has won!`)
                        setGameOver(true)
                    }
                    else if(gameServices.nobodyWins(newPlayerData, width, height, disabledSquares)){
                        alert("Nobody wins :(")
                        setGameOver(true)
                    }
                    else{
                        gameServices.selectNextPlayer(newPlayerData)
                    }
                }
            }
            const grid = gameServices.createGridArray(width, height, newPlayerData, disabledSquares)
            setGrid(grid)
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
    }, [width, disabledSquares, gridy])
    
    if (width === 0 && height === 0 && player === null){
        return (<></>)
    }
    else if (playerData === null){
        const players = new Array()
        let squares = []
        players.push(player)
        gameAPI.createGame(players, width, height, minMoves, disableSquares)
            .then(response => {
                setGrid(response.data.grid)
                index = response.data.grid.length * response.data.grid[0].length
                setDisabledSquares(response.data.disabledSquares)
                setPlayerData(response.data.playerData)
            })
        return (<></>)
    }
    
    if(playerData !== null){
        console.log(playerData)
    }

    return (
        <div className="gameBackground">
            <Navigation quitGame={quitGame} restartGame={restartGame}/>
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