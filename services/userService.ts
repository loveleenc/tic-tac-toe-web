import User from "../models/user"
import bcrypt from 'bcrypt'
import AuthenticationError from "../utils/errors"
import jwt from 'jsonwebtoken'


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

const getAllUsers = async () => {
    const users = await User.find({})
    return users
}

export default {
    getAllUsers,
    validateLogin
}