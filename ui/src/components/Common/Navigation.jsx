import '../../styles/navigation.css'

const Navigation = ({buttons, quitGame, restartGame, style}) => {
    return(
        <div style={style} className='navigationbar'>
            {buttons.map((button, index) => <a key={index} className="navButtons" onClick={button.action}>{button.text}</a>)}
        </div>)
}

export default Navigation