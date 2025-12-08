import { Request, Response, Router } from "express";
import userService from "../services/userService";
import errors from "../utils/errors";
import { LoggedInUserRequest } from "../types/express/request";
import middleware from "../utils/middleware";

const loginRouter = Router();

loginRouter.get(
  "/whoami",
  middleware.extractUser, middleware.refreshToken,
  async (request: LoggedInUserRequest, response: Response) => {
    try {
      if (request.user === null) {
        response
          .status(401)
          .json({ error: "Unable to login. Please try again." });
        return;
      } else {
        const userInfoFiltered = {
          username: request.user.username,
          name: request.user.name,
        };
        response.status(200).json(userInfoFiltered);
        return;
      }
    } catch (error: unknown) {
      let errorMessage = "something went wrong. ";
      if (error instanceof Error) {
        errorMessage += error.message;
      }
      response.status(400).json({ error: errorMessage });
    }
  }
);

loginRouter.post("/", async (request: Request, response: Response) => {
  try {
    if (!request.body.username || !request.body.password) {
      response
        .status(400)
        .json({ error: "please enter a valid username and password" });
    }

    const userInfo = await userService.validateLogin(
      request.body.username,
      request.body.password
    );
    response.cookie("token", userInfo.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    response.cookie("refreshToken", userInfo.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    const { token, refreshToken, ...remaining } = userInfo;
    const userInfoFiltered = { ...remaining };
    response.status(201).json(userInfoFiltered);
  } catch (error: unknown) {
    let errorMessage = "something went wrong. ";
    if (error instanceof errors.AuthenticationError || error instanceof errors.DeactivatedAccountError) {
      errorMessage += error.message;
      response.status(401).json({ error: errorMessage });
      return;
    }
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    response.status(400).json({ error: errorMessage });
  }
});

export default loginRouter;
