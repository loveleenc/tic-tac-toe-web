import { useState } from "react";

const Square = ({id, getSquareId, text}) => {
    const [isDisabled, setDisabled] = useState(false)

    
    const handleImgClick = (event) => {
        console.log("clicking image")
        event.stopPropagation();
        event.target.src = "src/assets/ivysaur.gif"
        const parent = event.currentTarget.parentNode;
        getSquareId(parent)
        setDisabled(true)
    }

    return(<>
        <button id={id} className='block' disabled={isDisabled}>
            <img className='playerSprite' src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" onClick={handleImgClick}/>
        </button>
    </>)
}

export default Square