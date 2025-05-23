import './../styles/mainScreen.css'


const PLAY_BUTTON_GREEN = 'src/assets/mainScreen/PlayButton.png' 
const PLAY_BUTTON_HIGHLIGHTED = 'src/assets/mainScreen/PlayButtonHighlight.png'

const MainScreen = ({handlePlayButtonClick}) => {

    const onMouseOverPlayButton = (event, b) =>{
        event.target.src = b
    }
    return(
    <div className="mainScreenBackground">
        <div className="gameTitle">
            <img src='src/assets/mainScreen/ttt_title.gif' />
        </div>
        <div>
            <img id="boo" className="playButton" src={PLAY_BUTTON_GREEN}
                            onMouseOver={() => onMouseOverPlayButton(event, PLAY_BUTTON_HIGHLIGHTED)}
                            onMouseOut={() => onMouseOverPlayButton(event, PLAY_BUTTON_GREEN)}
                            onClick={handlePlayButtonClick}/>
        </div>
    </div>)
}

export default MainScreen