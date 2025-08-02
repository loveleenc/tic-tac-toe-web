import Score from "../models/scores";
import { database } from "./databaseService";

const getScoreForAllUsers = async () => {
    const scores = await Score.find({}).populate('user', { name: 1 });
    const filteredScores = scores.map(score => {
        const filteredScore = {
            wins: score.wins,
            losses: score.losses,
            ties: score.ties,
            user: score.user,
        }
        return filteredScore;
    })
    return filteredScores;
}

const addWinToUserScore = async (username: string | null):Promise<void> => {
    if(username === null || username.startsWith("Guest_")){
        return;
    }
    database.addWinToUserScore(username);
}

const addLossToUserScore = async (username: string | null) => {
    if(username === null || username.startsWith("Guest_")){
        return;
    }
    database.addLossToUserScore(username);
}

const addTieToUserScore = async (username: string | null) => {
    if(username === null || username.startsWith("Guest_")){
        return;
    }
    database.addTieToUserScore(username);
}

export default {
    getScoreForAllUsers,
    addWinToUserScore,
    addLossToUserScore,
    addTieToUserScore
}