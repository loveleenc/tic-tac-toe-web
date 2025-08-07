import { ReturnedUser, ScoreModelPopulated, UserModel, UserModelId } from "../../types/models";
import { accountType } from "../../types/types";
import Database from "./Database";



class DatabaseTest extends Database{
    users: UserModelId[];
    scores: ScoreModelPopulated[];

    constructor(){
        super();
        this.users = new Array();
        this.scores = new Array();
    }

    async createNewUser(userData: UserModel): Promise<ReturnedUser> {
        const newUser = {
            ...userData,
            id: (this.users.length + 1).toString(),
        }
        this.users.push(newUser);
        const filteredUser:ReturnedUser = {
            id: newUser.id,
            username: newUser.username,
            name: newUser.name
        }
        const score = {
            wins: 0,
            losses: 0,
            ties: 0,
            user: newUser.username,
        }
        this.scores.push(score);
        return new Promise((resolve, _reject) => {
            resolve(filteredUser);
        });
    }

    async findUserAndUpdatePassword(username: string, newPasswordHash: string): Promise<void> {
        const user = this.users.find(user => user.username === username)
        if(user){
            user.passwordHash = newPasswordHash;
        }
        return new Promise((_resolve, _reject) => {});
    }

    async findUserAndUpdateStatus(username: string, status: accountType): Promise<void> {
        const user = this.users.find(user => user.username === username)
        if(user){
            user.status = status;
        }
        return new Promise((_resolve, _reject) => {});
    }

    async getUserByEmail(email: string): Promise<ReturnedUser> {
        const user = this.users.find(user => user.email === email);
        if(user){
            const filteredUser:ReturnedUser = {
            id: user.id,
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
        let filteredUser = null;
        const user = this.users.find(user => user.username === username);
        if(user){
            filteredUser = {
                name: user.name,
                username: user.username,
                passwordHash: user.passwordHash,
                status: user.status,
                email: user.email,
                id: user.id.toString(),
            }
        }
        return new Promise((resolve, _reject) => {
            resolve(filteredUser);
        });
    }

    async getUserById(id: string): Promise<ReturnedUser | null> {
        let filteredUser = null;
        const user = this.users.find(user => user.id === id);
        if(user){
            filteredUser = {
                id: user.id,
                username: user.username,
                name: user.name
            }
        }
        return new Promise((resolve, _reject) => {
            resolve(filteredUser);
        });
    }

    async getAllUsers(): Promise<ReturnedUser[]> {
        let filteredUsers = this.users.map(user => {
            const filteredUser:ReturnedUser = {
                username: user.username,
                id: user.id,
                name: user.name
            }
            return filteredUser;
        })
        return new Promise((resolve, _reject) => {
            resolve(filteredUsers);
        });
    }

    protected async getScore(username: string): Promise<null | ScoreModelPopulated> {
        const user = await this.getUserByUsername(username);
        if(!user){
            return null;
        }
        let score = this.scores.find(score => score.user === username);
        if(!score){
            return null;
        }
        return score;
    }

    async addWinToUserScore(username: string): Promise<void> {
        const score = await this.getScore(username);
        if(score !== null){
            score.wins += 1;
        }
    }

    async addLossToUserScore(username: string): Promise<void> {
        const score = await this.getScore(username);
        if(score !== null){
            score.losses += 1;
        }
    }

    async addTieToUserScore(username: string): Promise<void> {
        const score = await this.getScore(username);
        if(score !== null){
            score.ties += 1;
        }
    }

    async getAllScores(): Promise<ScoreModelPopulated[]> {
        return new Promise((resolve, _reject) => {
            resolve(this.scores);
        });
    }
}


const testDatabase = new DatabaseTest();
export default testDatabase;