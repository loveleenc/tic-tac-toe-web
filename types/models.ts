import { ObjectId } from "mongoose"
import { accountType } from "./types"

export interface UserModel{
    name: string,
    username: string,
    passwordHash: string,
    email: string,
    status: accountType
}

export interface ScoreModel{
    wins: number,
    losses: number,
    ties: number,
    user: ObjectId,
}

export interface ReturnedUser{
    name: string,
    username:string,
    id: string
}

export interface UserPayload{
    username: string,
    id: ObjectId
}