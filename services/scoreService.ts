import { database } from "./databaseService";

const getScoreForAllUsers = async () => {
    const scores = await database().getAllScores();
    return scores;
}

const addWinToUserScore = async (username: string | null):Promise<void> => {
    if(username === null || username.startsWith("Guest_")){
        return;
    }
    database().addWinToUserScore(username);
}

const addLossToUserScore = async (username: string | null) => {
    if(username === null || username.startsWith("Guest_")){
        return;
    }
    database().addLossToUserScore(username);
}

const addTieToUserScore = async (username: string | null) => {
    if(username === null || username.startsWith("Guest_")){
        return;
    }
    database().addTieToUserScore(username);
}

export default {
    getScoreForAllUsers,
    addWinToUserScore,
    addLossToUserScore,
    addTieToUserScore
}