
const Square = ({id, getSquareId}) => {
    {/* <img src="src/assets/ivysaur.gif" onClick={handleImgClick}/> */}
    function handleImgClick(e) {
        e.stopPropagation();
        const parent = e.currentTarget.parentNode;
        getSquareId(parent)
    }
    const text=""


    return(<>
        <button id={id} className='block' onClick={getSquareId}>{text}</button>
    </>)
}

export default Square