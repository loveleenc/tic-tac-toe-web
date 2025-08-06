import { useState, useCallback, useEffect, useRef } from "react"
import gameAPI from "../../services/gameAPI.js"
import Navigation from '../Common/Navigation.jsx'
import './../../styles/game.css'
import { useLocation, useNavigate, useParams } from "react-router-dom"
import Common from "../Common/Common.jsx"
import Grid from "./Grid.jsx"
import game from "../../utils/game.js"
import types from "../../types/types.js"
import { socket } from "../../socket.js"

const GameMultiPlayer = () => {
    const GAME_ID_MESSAGE = "Please share below game room id with other players to join the game:" 
    const {state} = useLocation(); 
    const navigate = useNavigate();

    const [grid, setGrid] = useState([])
    const [playerData, setPlayerData] = useState(null)
    const [gameOver, setGameOver] = useState(false)
    const [isConnected, setIsConnected] = useState(false)

    const [gameIdMessage, setGameIdMessage] = useState("")  
    const dialogRef = useRef(null);
    const multiplayerGameType = useParams().multiGameType
    const [status, setStatus] = useState("");
    const [disconnectionReason, setDisconnectionReason] = useState(null)


    useEffect(() => {   
        if(gameIdMessage !== ""){
            dialogRef.current.showModal();
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

    const exitGame = () => {
        if(window.confirm("Do you want to quit the game?")){
            socket.disconnect();
            navigate("/")
        }
    }

    useEffect(() => {   
        if (gameOver){
            socket.disconnect();
            setTimeout(() => {
                navigate("/");
            }, 1000)
            
        }
    }, [gameOver])

    useEffect(() => {
        socket.on('disconnect', () => {
            setIsConnected(false)
        });

        socket.on('joinGame', (result) => {
            if("error" in result){
                setDisconnectionReason(result.error);
                socket.disconnect();
                setTimeout(() => {
                    navigate('/')
                }, 5000);
                
            }
        });

        socket.on('connect', () => {
            if(multiplayerGameType === types.MultiplayerGameTypes.JOIN){
                socket.emit('joinGame', state.gameId, state.playerSymbol);
            }
            if(multiplayerGameType === types.MultiplayerGameTypes.CREATE){
                socket.emit('newGame', game.getGameId());
            }
            setIsConnected(true)
        });
        
        socket.on('joinedGame', (result) => {
            setGrid(result.game.grid);
            setPlayerData(result.game.playerData);
            const newMessage = `You have joined the game`;
            setStatus(newMessage);
        })

        socket.on('playerJoined', (gameAndNewPlayerData, newPlayerUsername) => {
            const updatedGame = gameAndNewPlayerData.game;
            setPlayerData(updatedGame.playerData);
            const newMessage = `Player ${newPlayerUsername}(${gameAndNewPlayerData.symbol}) has joined the game`;
            setStatus(newMessage);
        })

        socket.on('playerLeft', (playerUsername) => {
            const newMessage = `${playerUsername} has left the game`;
            setStatus(newMessage);
        })

        if(multiplayerGameType === types.MultiplayerGameTypes.JOIN){
            socket.connect();
        }
    }, []);


    if (playerData === null){
        if(multiplayerGameType === types.MultiplayerGameTypes.CREATE){
            gameAPI.createGame(state.players, state.width, state.height, state.minMoves, state.disableSquares, state.gameType, state.difficulty)
            .then(response => {
                setGrid(response.data.grid)
                setPlayerData(response.data.playerData)
                setGameIdMessage(`${GAME_ID_MESSAGE}\n${game.getGameId()}`);
                socket.connect();
            })
        }
        return (<></>)
    }

    return (
        <>
            <div className="gameBackground gameBackgroundHeightMultiplayer">
                <Grid grid={grid} getSquareId={getSquareId} />
                <Navigation buttons={[
                    {text: 'Exit',
                    action: exitGame}
                ]} style={{position: 'fixed', top: 0}}/>
                <Common.MessageDialog dialogRef={dialogRef} message={gameIdMessage}/>
                <p style={{left: '5px', bottom: '15px', position: 'absolute', padding: '5px'}} className="pixelFontStyle">player updates go here blah blah blah</p>
                <CurrentPlayerTimer seconds="5" />
            </div>
            <div className="gameStatusWindow pixelFontStyle">
                <p>{status}</p>
            </div>
            <Common.CurrentPlayer playerData={playerData} isSocketConnected={isConnected} socketDisconnectedReason={disconnectionReason}/>
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