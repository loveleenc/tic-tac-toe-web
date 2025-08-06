import LoadingScreen from "../Games/LoadingScreen";

const FormInput = ({ text, fieldName, type, customStyle }) => {
  if (type === "number") {
    return (
      <p className="pixelFontStyle">
        {text}
        <input
          type={type}
          className="formInput"
          name={fieldName}
          min="3"
          onWheel={(event) => event.target.blur()}
        />
      </p>
    );
  }

  return (
    <p className="pixelFontStyle" style={customStyle}>
      {text}
      <input type={type} className="formInput" name={fieldName} />
    </p>
  );
};

const NavigationButton = (props) => {
  return (
    <div className="buttonContainer navigationButton" style={props.buttonLocation}>
      <img
        src="/assets/navigation/common.png"
        role="button"
        className="commonButtonImage"
      />
      <div onClick={props.onClickEventHandler} className="commonButtonText pixelFontStyle" style={{fontWeight: 'bold'}}>
        {props.text}
      </div>
      {props.children}
    </div>
  );
};

const MessageDialog = ({dialogRef, message}) => {
    return (<dialog ref={dialogRef} style={{width: "60%", borderRadius: "3%"}}>
        <div className="pixelFontStyle">{message}</div>
        <form method="dialog">
            <NavigationButton text="Okay" onClickEventHandler={() => dialogRef.current.close()}/>
        </form>
    </dialog>)
}

const CurrentPlayer = ({playerData, isSocketConnected, socketDisconnectedReason}) => {
    if(socketDisconnectedReason === null){
      socketDisconnectedReason = "Disconnected. Please check your internet connection or rejoin the game."
    }   
    if(isSocketConnected === false){
        return (<LoadingScreen message={socketDisconnectedReason} display={true}/>)
    }

    if(playerData.length > 1){
        return (
            <>
                <p style={{position: 'absolute', top: '45px'}} className="pixelFontStyle">Current player: {playerData.find(p => p.turn === true).symbol}</p>
            </>
        )
    }
    else{
      return (<LoadingScreen message="Waiting for other players to join..." display={true}/>)
    }
    
}

export default {
  MessageDialog,
  FormInput,
  NavigationButton,
  CurrentPlayer
};
