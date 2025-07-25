import { Request, Response, Router } from "express";
import accountService from "../services/accountService";
import middleware from "../utils/middleware";
import path from 'path';

const accountRouter = Router()

accountRouter.post('/', middleware.parseNewAccount, async (request: Request, response: Response) => {
    const createdUser = await accountService.createNewUser(request.body.name, request.body.username, request.body.password, request.body.email)
    await accountService.sendActivationLinkViaEmail(request.body.email, createdUser);
    response.status(201).send(createdUser);
})

accountRouter.get('/verify/:id', async (_request:Request, response:Response) => {
    response.status(200).sendFile(path.resolve(__dirname, '..', '..', 'ui/dist/index.html'));
    return;
})

accountRouter.get('/reset/:id', async (_request:Request, response:Response) => {
    response.status(200).sendFile(path.resolve(__dirname, '..', '..', 'ui/dist/index.html'));
    return;
})

accountRouter.patch("/verifyAccount/:id", async (request:Request, response:Response) => {
    if(!request.body.username){
        response.status(400).send({error: "Please enter username to activate account"});
        return;
    }
    if(!request.params.id){
        response.status(400).send({error: "Verification Id is missing in the request"});
        return;
    }
    await accountService.activateAccount(request.params.id, request.body.username);
    response.status(200).send({success: "Account activation successful"});
})

export default accountRouter