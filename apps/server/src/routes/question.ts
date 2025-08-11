import { createQuestion } from "@controller/quiz/questions";
import authMiddleware from "@middlewares/auth-middleware";
import type { Router } from "express";
import express from "express";

const quizQuestionRouter: Router = express.Router();

quizQuestionRouter.post(
  "/quizzes/:quizId/questions",
  authMiddleware,
  createQuestion,
);

export default quizQuestionRouter;
