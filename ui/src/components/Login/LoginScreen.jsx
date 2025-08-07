import { useNavigate } from "react-router-dom"
import Common from "../Common/Common.jsx"
import loginAPI from "../../services/loginAPI.js"
import { useEffect, useRef, useState } from 'react'
import accountAPI from "../../services/accountAPI.js"

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
            .catch(response => {
                if(response.response.data.error.includes("Account is still inactive")){
                    setNotification(response.response.data.error)
                }
                else{
                    setNotification(`Unable to login. Please check username or password.`)
                }
                dialogRef.current.showModal()
            })
    }

    useEffect(() => {
        loginAPI.whoami()
            .then(response => {
                navigate('/main')
            })
    }, [])

    return(
        <div>
            <form className="accountForm" onSubmit={handleLogin}>
                <Common.FormInput text="Username " fieldName="username" type="text"/>
                <Common.FormInput text="Password " fieldName="password" type="password"/>
                <Common.NavigationButton text="Login" onClickEventHandler={null} >
                    <input type="submit" className="hiddenButton"/>
                </Common.NavigationButton>
            </form>
            <Common.MessageDialog dialogRef={dialogRef} message={notification}/>
        </div>
    )
}

const ForgotPasswordDialog = ({dialogRef}) => {
    const divContainerRef = useRef(null)
    const [message, setMessage] = useState('')
    const [display, setDisplay] = useState(false)

    const sendPasswordResetRequest = (event) => {
        event.preventDefault();
        const email = event.target.resetEmail.value;
        const emailFormat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        if(!emailFormat.test(email)){
            setMessage("E-mail should be in the format: xxx@xxx.x");
            return;
        }
        accountAPI.requestResetPasswordEmail(email)
            .then(() => {
                setMessage("An e-mail has been sent to you. Please check your e-mail and use the link in it to reset your password.");
            })
            .catch((response) => {
                setMessage(response.response.data.error);
            })
    }

    return(
        <dialog ref={dialogRef} style={{width: "60%", borderRadius: "4%", height: "60%"}}>
            <div ref={divContainerRef} style={{lineHeight: 2, overflowY: 'scroll', textAlign: 'center', height: "80%" }}>
                <div className="pixelFontStyle">Oh no! Did you forget your password? Well, there's nothing you can do about it now! *tears*</div>
                <img src="/assets/loginScreen/noooo-star-wars.gif" style={{borderRadius: "5%"}}/>
            
                <div className="pixelFontStyle" style={{whiteSpace: 'pre-line'}}>{`...\n...\n...\n...\n...`}</div>
                <div className="pixelFontStyle">Just kidding, you goober.</div>
                <div className="pixelFontStyle">
                    <span>Click </span>
                    <span className="boldFont" onClick={() => {
                        setDisplay(true);
                        setTimeout(() => divContainerRef.current.scrollBy({
                                                                            top: 200,
                                                                            behavior: "smooth",
                                                                            }), 50);
                        }}>here</span>
                    <span> to reset your password.</span>
                    <form style={{display: display ? '' : 'none'}} className="createAccountForm" onSubmit={sendPasswordResetRequest}>
                        <Common.FormInput text="E-mail " fieldName="resetEmail" type="text" customStyle={{width: 'fit-content', marginRight: 'auto', marginLeft: 'auto'}}/>
                        <div style={{paddingLeft: '5px'}} className="pixelFontStyle">{message}</div>
                        <Common.NavigationButton text="Create" onClickEventHandler={null} >
                            <input type="submit" className="hiddenButton"/>
                        </Common.NavigationButton>
                    </form>
                </div>

            </div>
            <form method="dialog">
                <Common.NavigationButton text="Okay" onClickEventHandler={() => {
                    divContainerRef.current.scrollTo(0, 0);
                    setMessage("");
                    setDisplay(false);
                    dialogRef.current.close();
                    }}/>
            </form>
        </dialog>
    )
}

const CreateAccountDialog = ({dialogRef}) => {
    const [message, setMessage] = useState('')
    const [criteriaList, setCriteriaList] = useState([])

    const ALL_CRITERIA = ["Name should be alphanumeric and between 2 and 40 characters", 
                        "Username should be alphanumeric and between 6 and 13 characters",
                        "Password should be between 7 and 128 characters and contain upper case and lower case characters, a digit and a special character",
                        "E-mail should be in the format: xxx@xxx.x"]
    const CRITERIA_MESSAGE = "Details should be in the following format:"
    const ACCOUNT_CREATION_SUCCESSFUL = "Account has been created successfully! Please check your e-mail and follow the instructions to activate your account."

    const stringIsAlphanumeric = (expectedString) => {
        for(let i = 0; i < expectedString.length; i++){
            let c = expectedString.charAt(i);
            if(!(c >= '0' && c <= '9') && !(c >= 'a' && c <= 'z') && !(c >= 'A' && c <= 'Z')){
            return false;
            }
        }
        return true;
    }

    const passwordMatchesCriteria = (password) => {
        let lowerCaseFound = false;
        let upperCaseFound = false;
        let numberFound = false;
        let specialCharacterFound = false;
        const specialCharacters = /[!^@#$%*]/;

        let criteriaMatched = true;
        for(let i = 0; i < password.length; i++){
            const c = password.charAt(i);
            if(c >= 'a' && c <= 'z'){
            lowerCaseFound = true;
            }
            else if(c >= 'A' && c <= 'Z'){
            upperCaseFound = true;
            }
            else if(c >= '0' && c <= '9'){
            numberFound = true;
            }
            else if(specialCharacters.test(c)){
            specialCharacterFound = true;
            }    
            else{
            criteriaMatched = false;
            return criteriaMatched;
            }
        }
        criteriaMatched = lowerCaseFound && upperCaseFound && numberFound && specialCharacterFound;
        return criteriaMatched;
    }


    const sendAccountCreationRequest = (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        const email = event.target.email.value;
        const name = event.target.name.value;

        const emailFormat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        if(!(username.length > 6 && 
            username.length < 13 && 
            stringIsAlphanumeric(username) &&
            password.length > 7 && 
            password.length < 128 && 
            passwordMatchesCriteria(password) &&
            name.length > 2 && name.length < 40 && stringIsAlphanumeric(name) &&
            emailFormat.test(email))){
                setMessage(CRITERIA_MESSAGE);
                setCriteriaList(ALL_CRITERIA);
                return;
        }

        accountAPI.createAccount(username, password, name, email)
            .then(() => {
                setMessage(ACCOUNT_CREATION_SUCCESSFUL);
                setCriteriaList([]);
            })
            .catch((response) => {
                setMessage(response.response.data.error);
                setCriteriaList([]);
            })
    }
    return (
        <dialog ref={dialogRef} style={{height: "50%", borderRadius: "4%", width: "80%"}}>
            <form className="createAccountForm" onSubmit={sendAccountCreationRequest}>
                <Common.FormInput text="Username " fieldName="username" type="text" customStyle={{width: 'fit-content', marginRight: 'auto', marginLeft: 'auto'}}/>
                <Common.FormInput text="Password " fieldName="password" type="password" customStyle={{width: 'fit-content', marginRight: 'auto', marginLeft: 'auto'}}/>
                <Common.FormInput text="Name " fieldName="name" type="text" customStyle={{width: 'fit-content', marginRight: 'auto', marginLeft: 'auto'}}/>
                <Common.FormInput text="E-mail " fieldName="email" type="text" customStyle={{width: 'fit-content', marginRight: 'auto', marginLeft: 'auto'}}/>
                <div style={{paddingLeft: '5px'}} className="pixelFontStyle">{message}</div>
                <ul>{criteriaList.map((criteria, index) => <li className="pixelFontStyle" key={index} style={{paddingBottom: '2px', paddingLeft: '5px'}}>{criteria}</li>)}</ul>
                <Common.NavigationButton text="Create" onClickEventHandler={null} >
                    <input type="submit" className="hiddenButton"/>
                </Common.NavigationButton>
            </form>
            
            <Common.NavigationButton text="Cancel" onClickEventHandler={() => {
                setMessage('')
                setCriteriaList([])
                dialogRef.current.close()}} />
        </dialog>
    )
}

const LoginScreen = () => {
    const forgotPasswordDialogRef = useRef(null);
    const createAccountDialogRef = useRef(null);
    
    return (<div className="mainScreenBackground">
                <div className="gameTitle">
                    <img src="/assets/mainScreen/ttt_title.gif" />
                </div>
                <Login />
                <div className="forgotPassword pixelFontStyle navigationButton" onClick={() => forgotPasswordDialogRef.current.showModal()}>
                    Forgot password?
                </div>
                <ForgotPasswordDialog dialogRef={forgotPasswordDialogRef} />
                <div className="forgotPassword pixelFontStyle navigationButton" onClick={() => createAccountDialogRef.current.showModal()}>
                    New User?
                </div>
                <CreateAccountDialog dialogRef={createAccountDialogRef} />
            </div>)
}

export default LoginScreen