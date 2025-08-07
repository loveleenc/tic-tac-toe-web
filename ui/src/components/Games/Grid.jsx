import Square from "./Square"

const Grid = ({grid, getSquareId}) => {
    let index = grid.length * grid[0].length
    return (
        <div className="grid">
            {grid.map((row, i) => {
                let squares = row.map(s => <Square id={s.count} key={s.count} getSquareId={getSquareId} text={s.text} />)
                if (i + 1 < grid.length){
                    squares.push(<br key={index}/>)
                    index +=1
                }
                return squares
            })}
        </div>
    )
}


export default Grid