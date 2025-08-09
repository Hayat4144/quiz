import { login, registerUser } from "@controller/auth";
import express from "express";
import type { Router } from "express";

const authRouter: Router = express.Router();

authRouter.post("/register", registerUser);

authRouter.post("/login", login);

export default authRouter;
