import '../styles/navigation.css'

const Navigation = ({quitGame, restartGame}) => {
    return(<div className='navigationbar'>
        <a className="navButtons" onClick={quitGame}>Quit</a>
        <a className="navButtons" onClick={restartGame}>Restart</a>
    </div>)
}

export default Navigation