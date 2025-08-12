import {
  createQuestion,
  deleteQuizQuestion,
  getQuizQuestion,
  updateQuestion,
} from "@controller/quiz/questions";
import authMiddleware from "@middlewares/auth-middleware";
import type { Router } from "express";
import express from "express";

const quizQuestionRouter: Router = express.Router();

quizQuestionRouter.delete(
  "/quizzes/:quizId/questions/:questionId",
  authMiddleware,
  deleteQuizQuestion,
);

quizQuestionRouter.get(
  "/quizzes/:quizId/questions",
  authMiddleware,
  getQuizQuestion,
);

quizQuestionRouter.post(
  "/quizzes/:quizId/questions",
  authMiddleware,
  createQuestion,
);

quizQuestionRouter.put(
  "/quizzes/:quizId/questions",
  authMiddleware,
  updateQuestion,
);

export default quizQuestionRouter;
