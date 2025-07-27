import { Request, Response, Router } from "express";
import userService from "../services/userService";
import scoreService from "../services/scoreService";

const userRouter = Router()

userRouter.get('/', async (_request:Request, response:Response) => {
    try{
    const users = await userService.getAllUsers()
    response.send(users)
    }
    catch(error){
        let errorMessage = 'something went wrong. '
        if(error instanceof Error){
            errorMessage += error.message
        }
        response.status(400).json({error: errorMessage})
    }
})

userRouter.get('/scores', async (_request: Request, response:Response) => {
    try{
        const scores = await scoreService.getScoreForAllUsers();
        response.send(scores);
    }
    catch(error){
        let errorMessage = 'something went wrong. '
        if(error instanceof Error){
            errorMessage += error.message
        }
        response.status(400).json({error: errorMessage})
    }
})

export default userRouter