import { UserModel, UserModelId, ReturnedUser, ScoreModelPopulated, ScoreModel } from "../../types/models";
import Database from "./Database";
import User from "../../models/user";
import Score from "../../models/scores";
import { accountType } from "../../types/types";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";

class DatabaseLive extends Database{
    constructor(){
        super();
    }

    async createNewUser(userData: UserModel):Promise<ReturnedUser> {
        const user = new User(userData)
        const savedUser = await user.save();

        const filteredUser:ReturnedUser = {
            id: savedUser._id.toString(),
            username: savedUser.username,
            name: savedUser.name
        }
        const score = new Score({
            wins: 0,
            losses: 0,
            ties: 0,
            user: savedUser._id,
        })
        await score.save();
        return filteredUser;
    }

    async findUserAndUpdatePassword(username: string, newPasswordHash: string): Promise<void> {
        await User.findOneAndUpdate({username: username}, {passwordHash: newPasswordHash});
    }

    async findUserAndUpdateStatus(username: string, status: accountType): Promise<void> {
        await User.findOneAndUpdate({username: username}, {status: status});
    }

    async getUserByEmail(email: string): Promise<ReturnedUser> {
        const user = await User.findOne({email: email});
        if(user){
            const filteredUser:ReturnedUser = {
            id: user._id.toString(),
            username: user.username,
            name: user.name
            }
            return filteredUser;
        }
        else{
            throw new Error("unable to find an account associated with this e-mail")
        }        
    }

    async getUserByUsername(username: string): Promise<UserModelId | null> {
        let filteredUser:UserModelId | null = null;
        const user = await User.findOne({username: username});
        if(user){
            filteredUser = {
                name: user.name,
                username: user.username,
                passwordHash: user.passwordHash,
                status: user.status,
                email: user.email,
                id: user._id.toString(),
            }
            return filteredUser;
        }
        return filteredUser;
    }

    async getUserById(id: string): Promise<ReturnedUser | null> {
        let filteredUser:ReturnedUser | null = null;
        const user = await User.findById(id);
        if(user){
            filteredUser = {
                id: user._id.toString(),
                username: user.username,
                name: user.name
            }
        }
        return filteredUser;
    }

    async getAllUsers(): Promise<ReturnedUser[]> {
        const users = await User.find({});
        const filteredUsers = users.map(user => {
            const filteredUser:ReturnedUser = {
                username: user.username,
                id: user._id.toString(),
                name: user.name
            }
            return filteredUser;
        })
        return filteredUsers;
    }

    protected async getScore(username: string): Promise<HydratedDocument<ScoreModel> | null> {   //todo: add expected type for returned mongoose object
        const user = await this.getUserByUsername(username);
        if(user === null){
            return null;
        }
        const score = await Score.findOne({user: new mongoose.mongo.ObjectId(user.id)});
        return score;
    }

    async addWinToUserScore(username: string): Promise<void> {
        const score = await this.getScore(username);
        if(score !== null){
            score.wins += 1;
            await score.save();
        }
    }

    async addLossToUserScore(username: string): Promise<void> {
        const score = await this.getScore(username);
        if(score !== null){
            score.losses += 1;
            await score.save();
        }
    }

    async addTieToUserScore(username: string): Promise<void> {
        const score = await this.getScore(username);
        if(score !== null){
            score.ties += 1;
            await score.save();
        }
    }

    isUser(x: any): x is {_id: ObjectId} & {username: string}{
        return typeof x === "object" && "username" in x;
    }

    async getAllScores() {
        const scores = await Score.find({}).populate('user', { username: 1 });
        const filteredScores:ScoreModelPopulated[] = scores.map(score => {
            const filteredScore = {
                wins: score.wins,
                losses: score.losses,
                ties: score.ties,
                user: this.isUser(score.user) ? score.user.username : "unknown",
            }
            return filteredScore;
        })
        return filteredScores;
    }
}

const liveDatabase = new DatabaseLive();
export default liveDatabase; 