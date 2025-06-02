
import Square from "./Square"

const Grid = ({gridArray, getSquareId}) => {
    let index = gridArray.length * gridArray[0].length
    return (
    <>
    {gridArray.map((row, i) => {
        let squares = row.map(s => <Square id={s.count} key={s.count} getSquareId={getSquareId} text={s.text} />)
        if (i + 1 < gridArray.length){
            squares.push(<br key={index}/>)
            index +=1
        }
        return squares
    })}
    </>)
}


export default Grid