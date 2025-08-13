import {
  createQuestion,
  deleteQuizQuestion,
  getQuizQuestion,
  getQuizQuestionsForStudent,
  updateQuestion,
} from "@controller/quiz/questions";
import authMiddleware from "@middlewares/auth-middleware";
import type { Router } from "express";
import express from "express";

const quizQuestionRouter: Router = express.Router();

// teacher routes
quizQuestionRouter.delete(
  "/teacher/quizzes/:quizId/questions/:questionId",
  authMiddleware,
  deleteQuizQuestion,
);

quizQuestionRouter.get(
  "/teacher/quizzes/:quizId/questions",
  authMiddleware,
  getQuizQuestion,
);

quizQuestionRouter.post(
  "/teacher/quizzes/:quizId/questions",
  authMiddleware,
  createQuestion,
);

quizQuestionRouter.put(
  "/teacher/quizzes/:quizId/questions",
  authMiddleware,
  updateQuestion,
);

// student routes
quizQuestionRouter.get(
  "/quizzes/:quizId/questions",
  authMiddleware,
  getQuizQuestionsForStudent,
);

export default quizQuestionRouter;
