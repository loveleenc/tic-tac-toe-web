import '../../styles/navigation.css'

const Navigation = ({quitGame, restartGame}) => {
    return(<div className='navigationbar'>
        <a className="navButtons" onClick={quitGame}>Quit</a>
        {restartGame ? <a className="navButtons" onClick={restartGame}>Restart</a> : null}
    </div>)
}

export default Navigation