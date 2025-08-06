import gameAPI from "../services/gameAPI.js"


const validateGameIdFormat = (text) => {
    const gameIdFormat = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
    return gameIdFormat.test(text);
}

const getGameId = () => {
    const regex = "gameId=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
    const foundCookies = document.cookie.match(regex)
    if(!foundCookies){
        return ""
    }
    return foundCookies[0].split("gameId=")[1];
}

export default {
    getGameId,
    validateGameIdFormat
}