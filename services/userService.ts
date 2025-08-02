import bcrypt from 'bcrypt'
import errors from "../utils/errors"
import jwt from 'jsonwebtoken'
import { accountType } from "../types/types"
import { database } from "./databaseService"


const validateLogin = async (username: string, password: string) => {
    const user = await database.getUserByUsername(username);
    if(!user){
        throw new errors.AuthenticationError()
    }
    const passwordIsCorrect = await bcrypt.compare(password, user.passwordHash)
    
    if(!(user && passwordIsCorrect)){
        throw new errors.AuthenticationError()
    }
    if(user.status === accountType.INACTIVE){
        throw new errors.DeactivatedAccountError()
    }

    const userPayload = {
        username: user.username,
        id: user.id
    }
    if(typeof process.env.SECRET === 'string'){
        const token = jwt.sign(userPayload, process.env.SECRET, {expiresIn: 30 * 60})
        return {token: token, username: user.username, name: user.name}
    }
    else{
        throw new Error("unable to get token for user")
    }
}

const getAllUsers = async () => {
    const users = await database.getAllUsers();
    return users;
}

export default {
    getAllUsers,
    validateLogin
}