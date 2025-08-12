import { httpStatusCode } from "@customtype/http";
import { UserPayload } from "@customtype/index";
import { getUserById } from "@services/user-service";
import ApiError from "@utils/api-error";
import { verifyToken, options } from "@utils/jwt";
import { NextFunction, Request, Response } from "express";
import { VerifyOptions } from "jsonwebtoken";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      throw new ApiError("you are unauthorized.", httpStatusCode.UNAUTHORIZED);

    const isValidatoken = await verifyToken<UserPayload>(
      token,
      options as VerifyOptions,
    );

    if (!isValidatoken)
      throw new ApiError(
        "Something went wrong",
        httpStatusCode.INTERNAL_SERVER_ERROR,
      );

    const user = await getUserById(isValidatoken.id);
    if (!user)
      throw new ApiError("You are anauthorized.", httpStatusCode.UNAUTHORIZED);

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
