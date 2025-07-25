import User from '../models/user'
import { ReturnedUser, UserModel } from "../types/models"
import Score from "../models/scores"
import bcrypt from 'bcrypt'
import { accountType } from '../types/types'
import nodemailer from 'nodemailer'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { addAccountActivationId } from '../data/liveData'

const SALT_ROUNDS = 10

const createNewUser = async (name:UserModel["name"], username:UserModel["username"], password:string, email:UserModel["email"]):Promise<ReturnedUser> => {
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
    return savedUser as ReturnedUser
}

const createPassword = async (password:string):Promise<string> => {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    return passwordHash
}

const sendActivationLinkViaEmail = async (newUserEmail:string, createdUser:ReturnedUser) => {
    const userPayload = {
        username: createdUser.username,
        id: createdUser.id
    }
    if(typeof process.env.ACTIVATION_SECRET === 'string'){
        const token = jwt.sign(userPayload, process.env.ACTIVATION_SECRET, {expiresIn: 7200 * 60})
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USERNAME,
                pass: process.env.GMAIL_PASS
            },
        });
        transporter.sendMail({
            from: `tic-tac-toe game<${process.env.GMAIL_USERNAME}>`,
            to: newUserEmail,
            subject: "Account activation: tic-tac-toe",
            text: `Hello ${createdUser.name}! Here is the link to activate your account on the tic-tac-toe game website: ${process.env.CLIENT_URL}/account/verify/${token}`,
        }, (error, _info) => {
            if(error){
                throw new Error(`Unable to send email with the activation link: ${error.message}`)
            }
            addAccountActivationId(token);
            // console.log("Message sent: %s", info.messageId);
            // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        })
    }
    else{
        throw new Error("unable to create an account activation token for user")
    }
}


const activateAccount = async (token:string, userProvidedUsername:string) => {
    if(typeof process.env.ACTIVATION_SECRET === 'string'){
        const decodedToken = jwt.verify(token, process.env.ACTIVATION_SECRET) as JwtPayload
        if(decodedToken?.username){
            if(decodedToken.username === userProvidedUsername){
                await User.findOneAndUpdate({username: userProvidedUsername}, {status: accountType.ACTIVE});
            }
            else{
                throw new Error("Entered username is incorrect. Please try again.")
            }
        }
    }
    else{
        throw new Error("Unable to activate account. Please try again later.")
    }
}

export default {
    createNewUser,
    sendActivationLinkViaEmail,
    activateAccount
}