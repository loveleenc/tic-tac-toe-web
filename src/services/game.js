
const createComputerPlayer = (players) => {
    let computer = null
    function getRandomCharacter() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        const randomIndex = Math.floor(Math.random() * characters.length);
        computer = characters.charAt(randomIndex);
    }

    function symbolIsTaken(){
        for (const player of players){
            if (player === computer){
                return true
            }
        }
        return false
    }
    while (symbolIsTaken() || computer === null){
        getRandomCharacter()
    } 
    return computer
}


const createInitialPlayerData = (players) => {
    const template = {
        symbol: null,
        moves: [],
        turn: false,
        isComputer: false
    }
    const data = new Array()

    for(let i=0; i < players.length; i++){
        data.push({...template, moves: template.moves.slice(), symbol: players[i]})
    }
    
    const computerSymbol = createComputerPlayer(players)
    data.push({...template, symbol: computerSymbol, isComputer: true})
    selectFirstPlayer(data)
    return data
}

const selectFirstPlayer = (data) => {
    const randomIndex = Math.floor(Math.random() * data.length)
    data[randomIndex].turn = true
}

const updateMoveInPlayerData = (playerData, id) => {
    const currentPlayerIndex = playerData.findIndex(player => player.turn === true)
    const newPlayerData = playerData.slice()
    newPlayerData[currentPlayerIndex].moves.push(parseInt(id, 10))
    return newPlayerData
}

const selectNextPlayer = (playerData)=>{
    const currentPlayerIndex = playerData.findIndex(player => player.turn === true)
    if (currentPlayerIndex + 1 === playerData.length){
        playerData[0].turn = true
    }
    else{
        playerData[currentPlayerIndex + 1].turn = true
    }
    playerData[currentPlayerIndex].turn = false
}


const createGridArray = (width, height, playerData, disabledSquares) => {
    const grid = []
    let count = 0
    for (let i = 0; i < height; i++){
        let row = []
        for (let j = 0; j < width; j++){
            let text = ""
            for (const player of playerData){
                if (player.moves.includes(count)){
                    text = player.symbol
                    break
                }
            }
            if (text === ""){
                if(disabledSquares.includes(count)){
                    text = null
                }
            }
            row.push({count: count, text: text})
            count += 1
        }
        grid.push(row)
    }
    return grid
}

function* range(start, stop, step = 1) {
    if (stop == null) {
        stop = start
        start = 0
    }
    
    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        yield i
    }
}

const hasWon = (ids, pd, minMoves) => {
    const moves = pd.find((player) => player.turn === true).moves
    let count = 0
    for(const id of ids){
        if(moves.includes(id)){
            count +=1
        }
        if (count === minMoves){
            return true
        }
    }
    return false
}

const hasCurrentPlayerHasWon = (id, minMoves, width, height, pd) => {
    const maxCount = (width * height) - 1
    const leftList = [0]
    const rightList = [width - 1]
    for(let i=1; i<height; i++){
        leftList.push(leftList.slice(-1)[0] + width)
        rightList.push(rightList.slice(-1)[0] + width)
    }
    
    const vertical = []
    for(let i of range(id-(minMoves-1)*width, id+width, width)){
        if(i < 0){
            continue
        }
        vertical.push(i)
    }
    for(let i of range(id+width, id+(minMoves)*width, width)){
        if (i > maxCount){
            break
        }
        vertical.push(i)
    }
    

    const horizontal = []
    for(let i of range(id, id-minMoves, -1)){
        if (i == id){
            horizontal.push(i)
            continue
        }

        if(rightList.includes(i)){
            break
        }
        horizontal.push(i)
    }
    for(let i of range(id+1, id+minMoves)){
        if(leftList.includes(i)){
            break
        }
        horizontal.push(i)
    }
    horizontal.sort()

    const diagonal1 = []
    for(let i of range(id, id-(minMoves*(width + 1)), -(width+1))){
        if (i == id){
            diagonal1.push(i)
            continue
        }

        if(i < 0 || rightList.includes(i)){
            break
        }
        diagonal1.push(i)
    }
    for(let i of range(id+width+1, id+(minMoves*(width + 1)), width + 1)){
        if(i > maxCount || leftList.includes(i)){
            break
        }
        diagonal1.push(i)
    }
    diagonal1.sort()


    const diagonal2 = []
    for(let i of range(id-(width-1)*(minMoves-1), id, width - 1)){
        if (leftList.includes(i) || i < 0){
            continue
        }
        diagonal2.push(i)
    }

    for(let i of range(id, id+(width-1)*(minMoves), width - 1)){
        if (i == id){
            diagonal2.push(i)
            continue
        }
        if(rightList.includes(i) || i > maxCount){
            break
        }
        diagonal2.push(i)
    }

    return hasWon(vertical, pd, minMoves) || hasWon(horizontal, pd, minMoves) || hasWon(diagonal1, pd, minMoves) || hasWon(diagonal2, pd, minMoves)

}

const nobodyWins = (playerData, width, height) => {
    const total_moves = playerData.map(player => player.moves.length).reduce((a, c) => a + c, 0)
    return total_moves === (width * height)
}

const selectSquaresToDisable = (width, height) => {
    let squares = new Array()
    for (let i = 0; i < 5; i ++){
        squares.push(Math.floor(Math.random() * ((width * height) - 1)))
    }
    squares = [...new Set(squares)]
    return squares
}

export default {
    createInitialPlayerData,
    updateMoveInPlayerData,
    createGridArray,
    selectNextPlayer,
    hasCurrentPlayerHasWon,
    nobodyWins,
    selectSquaresToDisable
}