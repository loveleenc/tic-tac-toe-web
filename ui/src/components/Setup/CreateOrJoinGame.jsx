import { useNavigate } from "react-router-dom"
import Navigation from "../Common/Navigation"


const CreateOrJoinGame = () => {
    const navigate = useNavigate();

    const quitGame = () => {
        if(window.confirm("Do you want to quit the game?")){
            navigate('/')
        }
    }

    return (
        <>
        <Navigation quitGame={quitGame}/>
        <div className="setupContainer pixelFontStyle">
            <div className="formContainer form">
                <div>Create a new game or join an ongoing one?</div>
                <div style={{padding: '10px'}}>
                <button className="difficultyNavButton pixelFontStyle">Create new single/multi-player game</button>
                </div>
                <div style={{padding: '10px'}}>
                <button className="difficultyNavButton pixelFontStyle">Join ongoing game</button>
                </div>
            </div>
        </div>
        </>
        
    )

}

export default CreateOrJoinGame