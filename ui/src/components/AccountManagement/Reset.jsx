import { useNavigate, useParams } from "react-router-dom";
import accountAPI from "../../services/accountAPI";
import Common from "../Common/Common";
import { useState } from "react";

const ResetAccount = () =>{
    const [message, setMessage] = useState('')
    const token = useParams().id
    const navigate = useNavigate()

    const sendActivationRequest = (event) => {
        event.preventDefault()
        if(event.target.confirmPassword.value !== event.target.password.value){
          setMessage("Passwords do not match");
          setTimeout(() => setMessage(""), 5000)
          return;
        }
        accountAPI.sendResetPasswordRequest(token, event.target.password.value)
          .then(response => {
            setMessage("Your password has been reset! Please login to start playing. Redirecting you to login screen...")
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
            <div className="pixelFontStyle accountForm">Please enter the new password.</div>
            <div style={{marginRight: 'auto', marginLeft: 'auto', width:'fit-content'}}>
                <Common.FormInput text="Password " fieldName="password" type="text" />
                <Common.FormInput text="Confirm password " fieldName="confirmPassword" type="text" />
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


export default ResetAccount