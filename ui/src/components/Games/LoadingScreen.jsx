
const LoadingScreen = ({message, display}) => {
    const displayValue = display === true ? '' : 'none';
    return (
        <div style={{display: displayValue}}className="darkBackground">
          <div className="loadingScreen pixelFontStyle">
            {message}
          </div>
      </div>
    )
}

export default LoadingScreen