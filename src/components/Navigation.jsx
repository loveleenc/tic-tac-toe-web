import './../styles/navigation.css'

const Navigation = ({quitGame}) => {
    return(<div className='navigationbar'>
        <a className="navButtons" onClick={() => quitGame()}>Quit</a>
    </div>)
}

export default Navigation