import { useNavigate } from "react-router-dom"
import Common from "../Common"
import loginAPI from "../../services/loginAPI.js"
import { useRef, useState } from 'react'

const Login = () => {
    const navigate = useNavigate()
    const dialogRef = useRef(null);
    const [notification, setNotification] = useState('') 

    const handleLogin = async (event) => {
        event.preventDefault()
        const username = event.target.username.value
        const password = event.target.password.value
        loginAPI.loginToGame(username, password)
            .then(response => {
                navigate('/main')
            })
            .catch(error => {
                setNotification(`Unable to login. Please check username or password.`)
                dialogRef.current.showModal()
            })
    }

    const submitForm = (event) => {
        console.log("form submission shiz")
        form.onSubmit()
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
    return (<dialog ref={dialogRef}>
        <div className="pixelFontStyle">{message}</div>
        <form method="dialog">
            <button>OK</button>
        </form>
    </dialog>)
}

const LoginScreen = () => {
    return (<div className="mainScreenBackground">
        <div className="gameTitle">
        <img src="/assets/mainScreen/ttt_title.gif" />
        <Login />
      </div>
    </div>)
}

export default LoginScreen