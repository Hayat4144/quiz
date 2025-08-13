import {
  getQuizAttemtsForStudent,
  startAttempt,
  submitAttempt,
} from "@controller/quiz/attempts";
import authMiddleware from "@middlewares/auth-middleware";
import type { Router } from "express";
import express from "express";

const quizAttemptRouter: Router = express.Router();

quizAttemptRouter.get(
  "/quizzes/:quizId/attempts",
  authMiddleware,
  getQuizAttemtsForStudent,
);
quizAttemptRouter.post("/quizzes/attempts/start", authMiddleware, startAttempt);
quizAttemptRouter.post(
  "/quizzes/attempts/:attemptId/submit",
  authMiddleware,
  submitAttempt,
);

export default quizAttemptRouter;
