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

// style={{visibility: 'hidden'}}
export default {
  FormInput,
  NavigationButton
};
