import { Request, Response, Router } from "express";
import accountService from "../services/accountService";
import middleware from "../utils/middleware";

const accountRouter = Router()

accountRouter.post('/', middleware.parseNewAccount, async (request: Request, response: Response) => {
    try{
        const createdUser = accountService.createNewUser(request.body.name, request.body.username, request.body.password, request.body.email)
        response.status(201).send(createdUser);
        return;
    }
    catch(error: unknown){
        let errorMessage = 'something went wrong. '
        if(error instanceof Error){
            errorMessage += error.message
        }
        response.status(400).json({error: errorMessage})
    }
})


export default accountRouter