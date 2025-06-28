import Score from "../models/scores";
import User from "../models/user";

const getScoreForAllUsers = async () => {
    const scores = await Score.find({}).populate('user', { name: 1 });
    return scores;
}

const getScore = async (username: string | null) => {   //todo: add expected type for returned mongoose object
    if(username === null){
        return null;
    }
    const user = await User.findOne({ username: username });
    if(user === null){
        return null;
    }
    const score = await Score.findOne({user: user._id});
    return score;
}


const addWinToUserScore = async (username: string | null):Promise<boolean> => {
    const score = await getScore(username);
    if(score !== null){
        score.wins += 1;
        await score.save();
        return true;
    }
    return false;
    
}

const addLossToUserScore = async (username: string | null) => {
    const score = await getScore(username);
    if(score !== null){
        score.losses += 1;
        await score.save();
        return true;
    }
    return false;
}

const addTieToUserScore = async (username: string | null) => {
    const score = await getScore(username);
    if(score !== null){
        score.ties += 1;
        await score.save();
        return true;
    }
    return false;
}

export default {
    getScoreForAllUsers,
    addWinToUserScore,
    addLossToUserScore,
    addTieToUserScore
}