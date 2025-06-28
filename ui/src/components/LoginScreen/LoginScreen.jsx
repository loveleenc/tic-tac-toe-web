import { useNavigate } from "react-router-dom"
import Common from "../Common"
import loginAPI from "../../services/loginAPI.js"
import { useRef, useState } from 'react'

const Login = () => {
    const navigate = useNavigate()
    const dialogRef = useRef(null);
    const [notification, setNotification] = useState('') 
    const [user, setUser] = useState(null)

    const handleLogin = async (event) => {
        event.preventDefault()
        const username = event.target.username.value
        const password = event.target.password.value
        loginAPI.loginToGame(username, password)
            .then(response => {
                setUser(response.data.username);
                navigate('/main')
            })
            .catch(error => {
                setNotification(`Unable to login. Please check username or password.`)
                dialogRef.current.showModal()
            })
    }


    if(user !== null){
        navigate('/main')
        return null;
    }

    return(
        <div>
            <form className="loginForm" onSubmit={handleLogin}>
                <Common.FormInput text="Username " fieldName="username" type="text"/>
                <Common.FormInput text="Password " fieldName="password" type="password"/>
                <Common.NavigationButton text="Login" onClickEventHandler={null} >
                    <input type="submit" className="hiddenButton"/>
                </Common.NavigationButton>
            </form>
            <MessageDialog dialogRef={dialogRef} message={notification}/>
        </div>
    )
}

const MessageDialog = ({dialogRef, message}) => {
    return (<dialog ref={dialogRef} style={{width: "60%", borderRadius: "3%"}}>
        <div className="pixelFontStyle">{message}</div>
        <form method="dialog">
            <Common.NavigationButton text="Okay" onClickEventHandler={() => dialogRef.current.close()}/>
        </form>
    </dialog>)
}

const ForgotPasswordDialog = ({dialogRef}) => {
    const divContainerRef = useRef(null)

    return(
        <dialog ref={dialogRef} style={{width: "60%", borderRadius: "4%", height: "60%"}}>
            <div ref={divContainerRef} style={{lineHeight: 2, overflowY: 'scroll', textAlign: 'center', height: "80%" }}>
                <div className="pixelFontStyle">Oh no! Did you forget your password? Well, there's nothing you can do about it now! *tears*</div>
                <img src="/assets/loginScreen/noooo-star-wars.gif" style={{borderRadius: "5%"}}/>
            
                <div className="pixelFontStyle" style={{whiteSpace: 'pre-line'}}>{`...\n...\n...\n...\n...`}</div>
                <div className="pixelFontStyle">Just kidding, you goober.</div>
            </div>
            <form method="dialog">
                <Common.NavigationButton text="Okay" onClickEventHandler={() => {
                    divContainerRef.current.scrollTo(0, 0);
                    dialogRef.current.close()
                    }}/>
            </form>
        </dialog>
    )
}

const LoginScreen = () => {
    const dialogRef = useRef(null);
    return (<div className="mainScreenBackground">
                <div className="gameTitle">
                    <img src="/assets/mainScreen/ttt_title.gif" />
                </div>
                <Login />
                <div className="forgotPassword pixelFontStyle navigationButton" onClick={() => dialogRef.current.showModal()}>Forgot password?</div>
                <ForgotPasswordDialog dialogRef={dialogRef} />
            </div>)
}

export default LoginScreen