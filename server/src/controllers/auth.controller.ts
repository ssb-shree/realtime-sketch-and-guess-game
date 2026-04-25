import type { Request, Response } from "express";
import { User } from "../models/user.model";
import asyncHandler from "../utils/asyncHandler";
import { loginSchema, registerSchema } from "./auth.schema";
import ApiError from "../utils/apiError";

import jwt from "jsonwebtoken";
import { BAD_REQUEST, CONFLICT, OK, UNAUTHORIZED } from "../constants/status-codes";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";

const registerController = asyncHandler(async (req: Request, res: Response) => {
  // let zod validate the payload
  const { username, password, confirmPassword } = registerSchema.parse(req.body);

  // check if the user alreadu exists
  const userExist = await User.findOne({ username });

  if (userExist) throw new ApiError(409, "Username is taken");

  // create the user
  const user = await User.create({ username, password });

  // create a token
  const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET!, { expiresIn: "24hr" });

  // set token
  res.cookie("jwt", token, {
    httpOnly: false,
    secure: true,
    sameSite: "lax", 
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  // final response
  res.status(OK).json({ message: "user created successfully", user, success: true, token });
});

const loginController = asyncHandler(async (req: Request, res: Response) => {
  // let zod validate the payload
  const { username, password } = loginSchema.parse(req.body);

  // check if such user exist
  const userExist = await User.findOne({ username });

  if (!userExist) throw new ApiError(CONFLICT, "Invalid username or password");

  // commpare the password
  const validPassword = await userExist.comparePassword(password);

  if (!validPassword) throw new ApiError(CONFLICT, "Invalid username or password");

  // create a token
  const token = jwt.sign({ userID: userExist._id }, process.env.JWT_SECRET!, { expiresIn: "24hr" });

  // set token
  res.cookie("jwt", token, {
    httpOnly: false, 
    secure: true, 
    sameSite: "lax",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  res.status(OK).json({ message: "user logged in", userExist, success: true, token });
});

const getUserAuthenticated = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.status(OK).json({ message: "user authenticated successfully", success: true });
});

export { registerController, loginController, getUserAuthenticated };
