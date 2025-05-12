
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



export default {
    createInitialPlayerData
}