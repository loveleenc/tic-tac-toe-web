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

const NavigationButton = ({ text, onClickEventHandler }) => {
  return (
    <div className="buttonContainer navigationButton">
      <img
        src="/assets/navigation/common.png"
        role="button"
      />
      <div onClick={onClickEventHandler} className="commonButtonText pixelFontStyle" style={{fontWeight: 'bold'}}>
        {text}
      </div>
      {(!onClickEventHandler) ? <input type="submit" className="hiddenButton"/> : null}
    </div>
  );
};
// style={{visibility: 'hidden'}}
export default {
  FormInput,
  NavigationButton
};
