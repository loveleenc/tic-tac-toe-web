import { Router, Request, Response } from "express";


const logoutRouter = Router()

logoutRouter.post('/', (_request:Request, response:Response) => {
    response.cookie("token", "143rqeff1t5", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    response.status(201).json({success: "logged out successfully"});
    return;
})

export default logoutRouter