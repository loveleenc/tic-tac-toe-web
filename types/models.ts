import { ObjectId } from "mongoose"

export interface UserModel{
    name: string,
    username: string,
    passwordHash: string
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