
const Square = ({id, getSquareId, text}) => {

    {/* <img src="src/assets/ivysaur.gif" onClick={handleImgClick}/> */}
    const handleImgClick = (event) => {
        console.log("clicking image")
        event.stopPropagation();
        const parent = event.currentTarget.parentNode;
        getSquareId(parent)
        event.target.src = "src/assets/ivysaur.gif"
    }

    const handleClick = (event) => {
        event.stopPropagation();
        const button = event.currentTarget.parentNode;
        getSquareId(parent)
    }

    return(<>
        <button id={id} className='block'>
            <img src="data:," onClick={handleImgClick}/>
        </button>
    </>)
}

export default Square