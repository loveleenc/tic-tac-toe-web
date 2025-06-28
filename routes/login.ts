import { Request, Response, Router } from "express";
import userService from "../services/userService";
import AuthenticationError from "../utils/errors";


const loginRouter = Router()

loginRouter.post('/', async (request:Request, response:Response) => {
    try{
        if(!request.body.username || !request.body.password){
            response.status(400).json({error: 'please enter a valid username and password'})
        }

        const userInfo = await userService.validateLogin(request.body.username, request.body.password)
        response.cookie('token', userInfo.token, {httpOnly: true, secure: true, sameSite: "strict"});
        const { token, ...remaining} = userInfo;
        const userInfoFiltered = {...remaining};
        response.status(200).json(userInfoFiltered)
    }
    catch(error: unknown){
        let errorMessage = 'something went wrong. '
        if(error instanceof AuthenticationError){
            errorMessage += error.message
            response.status(401).json({error: errorMessage})
            return
        }
        if(error instanceof Error){
            errorMessage += error.message
        }
        response.status(400).json({error: errorMessage})
    }
})
export default loginRouter