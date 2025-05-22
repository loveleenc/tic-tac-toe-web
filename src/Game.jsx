import { useState, useCallback, useEffect } from "react"
import gameServices from "./services/game"
import Square from "./components/Square"
import game from "./services/game"

const Game = ({width, height, player, minMoves, handleGameOver}) => {
    const [playerData, setPlayerData] = useState(null)
    const [gameOver, setGameOver] = useState(false)
    let grid;
    let index;

    const updateGame = (id) => {
        setPlayerData(playerData => {
            let newPlayerData = gameServices.updateMoveInPlayerData(playerData, id)
            // const newPlayerData = playerData.slice()
            // const currentPlayerIndex = playerData.findIndex(player => player.turn === true)
            // newPlayerData[currentPlayerIndex].moves.push(parseInt(id, 10))

            if(gameServices.hasCurrentPlayerHasWon(id, minMoves, width, height, newPlayerData)){
                window.confirm(`Game over! Player ${newPlayerData.find(player => player.turn === true).symbol} Do you want to go back?`)
                setGameOver(true)
            }
            else if (gameServices.nobodyWins(newPlayerData, width, height)){
                alert("nobody won jack shit")
                setGameOver(true)
            }
            else{
                gameServices.selectNextPlayer(newPlayerData)
                // const currentPlayerIndex = newPlayerData.findIndex(player => player.turn === true)
                // if (currentPlayerIndex + 1 === newPlayerData.length){
                //     newPlayerData[0].turn = true
                // }
                // else{
                //     newPlayerData[currentPlayerIndex + 1].turn = true
                // }
                // newPlayerData[currentPlayerIndex].turn = false
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
    )
}

export default Game