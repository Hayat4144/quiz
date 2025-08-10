import { httpStatus, httpStatusCode } from "@customtype/http";
import { createUser, getUserByEmail } from "@services/user-service";
import ApiError from "@utils/api-error";
import asyncHandler from "@utils/async-handlar";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { NewUser } from "@workspace/db";
import { sendResponse } from "@utils/base-response";
import { getAccessToken } from "@utils/jwt";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      throw new ApiError("User already exists", httpStatusCode.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData: NewUser = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    const user = await createUser(userData);

    if (!user) {
      throw new ApiError(
        "Something went wrong please try again.",
        httpStatusCode.BAD_REQUEST,
      );
    }
    return sendResponse(
      res,
      httpStatusCode.OK,
      httpStatus.SUCCESS,
      "User registered successfully",
    );
  },
);

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);

  if (!user) {
    throw new ApiError("User not found", httpStatusCode.NOT_FOUND);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError("Invalid credentials", httpStatusCode.UNAUTHORIZED);
  }

  const token = await getAccessToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return sendResponse(
    res,
    httpStatusCode.OK,
    httpStatus.SUCCESS,
    "Login successful",
    { token },
  );
});
