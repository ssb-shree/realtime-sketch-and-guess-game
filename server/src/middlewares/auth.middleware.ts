import type { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import { BAD_REQUEST, UNAUTHORIZED } from "../constants/status-codes";
import jwt from "jsonwebtoken";

type DecodedPayload = {
  userID: string;
};

export interface AuthenticatedRequest extends Request {
  user?: DecodedPayload;
}

export const checkAuth = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) throw new ApiError(UNAUTHORIZED, "unauthorized no token provided");

  const decodedPayload = jwt.verify(token, process.env.JWT_SECRET!);
  if (!decodedPayload) throw new ApiError(BAD_REQUEST, "invalid token");

  req.user = decodedPayload as DecodedPayload;
  next();
});
