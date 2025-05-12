import Square from "./Square"


const Grid = ({width, height, players}) => {
    const getSquareId = (target) => {
        console.log(target.id)
    }

    const createGrid = () =>{
        const grid = []
        let count = 0
        for(let i=0; i< height; i++){
            let w = []
            for(let j = 0; j < width; j++){
                w.push(<Square id={count} key={count} getSquareId={getSquareId} text=""/>)
                count +=1
            }
            grid.push(w)
            grid.push(<br key={count}></br>)
        }
        
        return grid
    }

    return (
        <>
        {createGrid()}
        </>
    )
}

export default Grid