const FormInput = ({ text, fieldName, type }) => {
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
    <p className="pixelFontStyle">
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

export default {
  MessageDialog,
  FormInput,
  NavigationButton
};
