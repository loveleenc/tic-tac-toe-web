import bcrypt from 'bcrypt'
import errors from "../utils/errors"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { accountType } from "../types/types"
import { database } from "./databaseService"
import { ReturnedUser, UserModelId } from '../types/models'


const verifyTokenButIgnoreExpiry = async (token: string | undefined): Promise<JwtPayload | null> => {
    if (typeof process.env.SECRET === 'string' && token !== undefined) {
        return jwt.verify(token, process.env.SECRET, { ignoreExpiration: true }) as JwtPayload
    }
    return null;
}

const extractUserFromJwtPayload = async (jwtPayload: JwtPayload): Promise<ReturnedUser | null> => {
    if (jwtPayload?.id) {
        return await database().getUserById(jwtPayload.id);
    }
    return null;
}

const extractUserFromToken = async (token: string | undefined) => {
    let user: ReturnedUser | null = null;
    if (typeof process.env.SECRET === 'string' && token !== undefined) {
        const decodedToken = jwt.verify(token, process.env.SECRET) as JwtPayload
        if (decodedToken?.id) {
            user = await database().getUserById(decodedToken.id);
        }
    }
    return user;
}

const extractUserFromRefreshToken = async (token: string): Promise<ReturnedUser | null> => {
    if (typeof process.env.REFRESH_SECRET === 'string') {
        const decodedToken = jwt.verify(token, process.env.REFRESH_SECRET) as JwtPayload
        if (decodedToken?.id) {
            return await database().getUserById(decodedToken.id);
        }
    }
    return null;
}

const validatePassword = async (username: string, password: string): Promise<UserModelId> => {
    const user = await database().getUserByUsername(username);
    if (!user) {
        throw new errors.AuthenticationError()
    }
    const passwordIsCorrect = await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordIsCorrect)) {
        throw new errors.AuthenticationError()
    }
    if (user.status === accountType.INACTIVE) {
        throw new errors.DeactivatedAccountError()
    }
    return user;

}

const getNewAccessToken = (user: ReturnedUser | UserModelId) => {
    if (typeof process.env.SECRET === 'string') {
        const userPayload = {
            username: user.username,
            id: user.id,
        }
        return jwt.sign(userPayload, process.env.SECRET, { expiresIn: 10 * 60 });   //expires in 10 min
    }
    else {
        throw new Error("unable to get token for user")
    }
}


const getNewRefreshToken = (user: UserModelId) => {
    if (typeof process.env.REFRESH_SECRET === 'string') {
        const userPayload = {
            username: user.username,
            id: user.id,
        }
        return jwt.sign(userPayload, process.env.REFRESH_SECRET, { expiresIn: 24 * 60 * 60 });  //expires in 1 day
    }
    else {
        throw new Error("unable to get token for user")
    }
}

const validateLogin = async (username: string, password: string) => {
    const user = await validatePassword(username, password);
    const token = getNewAccessToken(user);
    const refreshToken = getNewRefreshToken(user);
    return { token: token, username: user.username, name: user.name, refreshToken: refreshToken };
}

const getAllUsers = async () => {
    const users = await database().getAllUsers();
    return users;
}

export default {
    getAllUsers,
    validateLogin,
    extractUserFromToken,
    extractUserFromRefreshToken,
    verifyTokenButIgnoreExpiry,
    extractUserFromJwtPayload,
    getNewAccessToken
}