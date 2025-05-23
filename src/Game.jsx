import { useState, useCallback, useEffect } from "react"
import gameServices from "./services/game"
import Square from "./components/Square"
import Navigation from './components/Navigation'

const Game = ({width, height, player, minMoves, handleGameOver}) => {
    const [playerData, setPlayerData] = useState(null)
    const [gameOver, setGameOver] = useState(false)
    let grid;
    let index;

    const updateGame = (id) => {
        setPlayerData(playerData => {
            let newPlayerData = gameServices.updateMoveInPlayerData(playerData, id)

            if(gameServices.hasCurrentPlayerHasWon(id, minMoves, width, height, newPlayerData)){
                alert(`Game over! Player ${newPlayerData.find(player => player.turn === true).symbol} has won!`)
                setGameOver(true)
            }
            else if (gameServices.nobodyWins(newPlayerData, width, height)){
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
            handleGameOver()
        }
    }, [gameOver])

    const quitGame = () => {
        if(window.confirm("Do you want to quit the game?")){
            setPlayerData(null)
            handleGameOver()
        }
    }

    const getSquareId = useCallback((id) => {
        const int_id = parseInt(id, 10)
        updateGame(int_id)
    }, [width, height])
    
    if (width === 0 && height === 0 && player === null){
        return (<></>)
    }
    else if (playerData === null){
        const players = new Array()
        players.push(player)
        const data = gameServices.createInitialPlayerData(players)
        setPlayerData(data)
        return (<></>)
    }
    
    grid = gameServices.createGridArray(width, height, playerData)
    index = grid.length * grid[0].length


    return (
        <>
            <Navigation quitGame={quitGame}/>
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
        </>
    )
}

export default Game