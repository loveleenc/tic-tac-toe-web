import { useNavigate } from "react-router-dom"
import Common from "../Common"
import loginAPI from "../../services/loginAPI.js"

const Login = () => {
    const navigate = useNavigate()
    const handleLogin = async (event) => {
        console.log("login blah")
        event.preventDefault()
        const username = event.target.username.value
        const password = event.target.password.value
        loginAPI.loginToGame(username, password)
            .then(response => {
                console.log('login successful')
                navigate('/main')
            })
            .catch(error => console.log("unable to login"))
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
                {/* <input type="image"  src="/assets/loginScreen/login.png" className="loginButton navigationButton" /> */}
                <Common.NavigationButton text="Login" onClickEventHandler={null} />
            </form>
        </div>
    )
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