import { useState, memo } from "react";
import './../../styles/game.css';

const Square = memo(({id, getSquareId, text}) => {
    const [isDisabled, setDisabled] = useState(false)

    
    const handleImgClick = (event) => {
        console.log("clicking image")
        event.stopPropagation();
        event.target.src = "src/assets/ivysaur.gif"
        const parent = event.currentTarget.parentNode;
        getSquareId(parent.id)
        setDisabled(true)
    }

    const handleButtonClick = (event) => {
        getSquareId(event.target.id)
        setDisabled(true)
    }

    // return(<>
    //     <button id={id} className='block' disabled={isDisabled}>
    //         <img className='playerSprite' src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" onClick={handleImgClick}/>
    //     </button>
    // </>)
    if (text === null){
        return (<>
                <button id={id} className='block' style={{backgroundColor: "gray"}} disabled={true} onClick={handleButtonClick}>{text}</button>
            </>)
    }
    if(text !== ""){
        return (<>
                <button id={id} className='block pixelFontStyle' disabled={true} onClick={handleButtonClick}>{text}</button>
            </>)
    }
    return (<>
        <button id={id} className='block' disabled={isDisabled} onClick={handleButtonClick}>{text}</button>
    </>)
})

export default Square