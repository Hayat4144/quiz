import {
  createQuiz,
  getQuiz,
  getQuizById,
  publishQuiz,
  quizOverview,
  updateQuiz,
} from "@controller/quiz";
import authMiddleware from "@middlewares/auth-middleware";
import type { Router } from "express";
import express from "express";

const quizRouter: Router = express.Router();

// teacher routes
quizRouter.get("/teacher/quizzes/overview", authMiddleware, quizOverview);
quizRouter.post("/teacher/quizzes", authMiddleware, createQuiz);
quizRouter.get("/teacher/quizzes", authMiddleware, getQuiz);
quizRouter.put("/teacher/quizzes", authMiddleware, updateQuiz);
quizRouter.get("/teacher/quizzes/:quizId", authMiddleware, getQuizById);
quizRouter.post(
  "/teacher/quizzes/:quizId/publish",
  authMiddleware,
  publishQuiz,
);

export default quizRouter;
