import { HydratedDocument } from "mongoose";
import { ReturnedUser, UserModel, UserModelId, ScoreModel, ScoreModelPopulated } from "../../types/models";
import { accountType } from "../../types/types";

abstract class Database {
    constructor(){
    }

    abstract createNewUser(userData:UserModel): Promise<ReturnedUser>;

    abstract findUserAndUpdateStatus(username:string, status:accountType): void;

    abstract getUserByEmail(email:string): Promise<ReturnedUser>;

    abstract findUserAndUpdatePassword(username:string, newPasswordHash:string): void;

    abstract getUserByUsername(username:string): Promise<UserModelId | null>;

    abstract getAllUsers(): Promise<ReturnedUser[]>;

    abstract getUserById(id:string): Promise<ReturnedUser | null>;
    
    protected abstract getScore(username:string): Promise<HydratedDocument<ScoreModel> | null | ScoreModelPopulated>;

    abstract addWinToUserScore(username:string): Promise<void>

    abstract addLossToUserScore(username:string): Promise<void>

    abstract addTieToUserScore(username:string): Promise<void>

    abstract getAllScores(): Promise<ScoreModelPopulated[]>
}

export default Database