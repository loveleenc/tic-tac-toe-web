import User from "../models/user"
import Score from "../models/scores"
import { UserModel } from "../types/models"
import bcrypt from 'bcrypt'
import AuthenticationError from "../utils/errors"
import jwt from 'jsonwebtoken'

const SALT_ROUNDS = 10
const createNewUser = async (name:UserModel["name"], username:UserModel["username"], password:string) => {
    const user = new User({
        name: name,
        username: username,
        passwordHash: await createPassword(password)
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


const validateLogin = async (username: string, password: string) => {
    const user = await User.findOne({username: username})
    if(!user){
        throw new AuthenticationError()
    }
    const passwordIsCorrect = await bcrypt.compare(password, user.passwordHash)
    
    if(!(user && passwordIsCorrect)){
        throw new AuthenticationError()
    }
    
    const userPayload = {
        username: user.username,
        id: user._id
    }
    if(typeof process.env.SECRET === 'string'){
        const token = jwt.sign(userPayload, process.env.SECRET, {expiresIn: 30 * 60})
        return {token: token, username: user.username, name: user.name}
    }
    else{
        throw new Error("unable to get token for user")
    }
}

const createPassword = async (password:string):Promise<string> => {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    return passwordHash
}

const getAllUsers = async () => {
    const users = await User.find({})
    return users

}
export default {
    createNewUser,
    getAllUsers,
    validateLogin
}