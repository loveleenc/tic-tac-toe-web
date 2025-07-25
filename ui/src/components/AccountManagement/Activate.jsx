import { useNavigate, useParams } from "react-router-dom";
import accountAPI from "../../services/accountAPI";
import Common from "../Common/Common";
import { useState } from "react";

const ActivateAccount = () =>{
    const [message, setMessage] = useState('')
    const token = useParams().id
    const navigate = useNavigate()

    const sendActivationRequest = (event) => {
        event.preventDefault()
        accountAPI.sendAccountActivationRequest(token, event.target.username.value)
          .then(response => {
            setMessage("Your account has been activated! Please login to start playing. Redirecting you to login screen...")
            setTimeout(() => navigate("/"), 7000)
          })
          .catch(response => {
            setMessage(response.response.data.error);
          })
    }

    return (
    <div className="mainScreenBackground">
      <div className="gameTitle">
        <img src="/assets/mainScreen/ttt_title.gif" />
      </div>
      <div>
        <form className="accountForm" onSubmit={sendActivationRequest}>
            <div className="pixelFontStyle accountForm">Please enter your username to activate your account.</div>
            <div style={{marginRight: 'auto', marginLeft: 'auto', width:'fit-content'}}>
                <Common.FormInput text="Username " fieldName="username" type="text" />
            </div>
            <Common.NavigationButton text="Submit" onClickEventHandler={null} >
                <input type="submit" className="hiddenButton"/>
            </Common.NavigationButton>
        </form>
        <div className="pixelFontStyle accountForm">{message}</div>
      </div>
      
    </div>
  );
}


export default ActivateAccount