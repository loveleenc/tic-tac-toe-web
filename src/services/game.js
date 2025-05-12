
const createComputerPlayer = (players) => {
    let computer = null
    function getRandomCharacter() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
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

export default {
    createComputerPlayer
}