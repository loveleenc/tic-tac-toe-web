import Square from "./Square"


const Grid = ({width, height, players, getSquareId}) => {
    

    const createGrid = () =>{
        const grid = []
        let count = 0
        for(let i=0; i< height; i++){
            let w = []
            for(let j = 0; j < width; j++){
                let text = ""
                for(const player of players){
                    if(player.moves.includes(count)){
                        text = player.symbol
                        break
                    }
                }
                w.push(<Square id={count} key={count} getSquareId={getSquareId} text={text}/>)
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