
const Square = ({id, getSquareId, text}) => {
    function handleImgClick(e) {
        e.stopPropagation();
        const parent = e.currentTarget.parentNode;
        getSquareId(parent)
    }


    return(<>
        <button id={id} className='block' onClick={getSquareId}>
        <img src="src/components/13d@2x.png" onClick={handleImgClick}/>
            {text}</button>
    </>)
}

export default Square