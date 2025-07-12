import { useNavigate } from "react-router-dom"
import Navigation from "../Common/Navigation"
import Togglable from "../Common/Togglable";
import Setup from "./Setup";


const CreateOrJoinGame = () => {
    const navigate = useNavigate();

    const quitGame = () => {
        if(window.confirm("Do you want to quit the game?")){
            navigate('/')
        }
    }

    return (
        <div style={{overflowY:'scroll', overflowX: 'hidden', maxHeight: '100vh'}}>
            <Navigation quitGame={quitGame}/>
            <div className="setupContainer pixelFontStyle">
                <div className="formContainer form">
                    <div>Create a new game or join an ongoing one?</div>
                    <div style={{padding: '10px'}}>
                    <Togglable buttonLabel="Create new single/multi-player game" buttonClassName="pixelFontStyle difficultyNavButton">
                        <Setup />
                    </Togglable>
                    </div>
                    <div style={{padding: '10px'}}>
                    <Togglable buttonLabel="Join ongoing game" buttonClassName="pixelFontStyle difficultyNavButton">
                        <div>blah</div>        
                    </Togglable>
                    </div>
                </div>
            </div>
        </div>
        
    )

}

export default CreateOrJoinGame