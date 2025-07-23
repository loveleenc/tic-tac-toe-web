import User from '../models/user'
import { UserModel } from "../types/models"
import Score from "../models/scores"
import bcrypt from 'bcrypt'
import { accountType } from '../types/types'


const SALT_ROUNDS = 10

const createNewUser = async (name:UserModel["name"], username:UserModel["username"], password:string, email:UserModel["email"]) => {
    const user = new User({
        name: name,
        username: username,
        passwordHash: await createPassword(password),
        email: email,
        status: accountType.INACTIVE
    })
    const savedUser = await user.save()
    
    const score = new Score({
        wins: 0,
        losses: 0,
        ties: 0,
        user: savedUser._id,
    })
    await score.save()
    return savedUser
}

const createPassword = async (password:string):Promise<string> => {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    return passwordHash
}


export default {
    createNewUser
}