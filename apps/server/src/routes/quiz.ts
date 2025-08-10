import { createQuiz, getQuiz, updateQuiz } from "@controller/quiz";
import authMiddleware from "@middlewares/auth-middleware";
import type { Router } from "express";
import express from "express";

const quizRouter: Router = express.Router();

quizRouter.post("/quizzes", authMiddleware, createQuiz);
quizRouter.get("/quizzes", authMiddleware, getQuiz);
quizRouter.put("/quizzes", authMiddleware, updateQuiz);

export default quizRouter;
