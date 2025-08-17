import { httpStatus, httpStatusCode } from "@customtype/http";
import { createNewQuiz, editQuiz, searchQuiz } from "@services/quiz-service";
import ApiError from "@utils/api-error";
import asyncHandler from "@utils/async-handlar";
import { sendResponse } from "@utils/base-response";
import { skip } from "@utils/index";
import { eq, ilike, quizTable, SQL } from "@workspace/db";
import type { Request, Response } from "express";

export const publishQuiz = asyncHandler(async (req: Request, res: Response) => {
  const { quizId } = req.params;

  if (!quizId && typeof quizId !== "string") {
    throw new ApiError("Invalid quiz id", httpStatusCode.BAD_REQUEST);
  }

  if (req.user.role !== "teacher") {
    throw new ApiError(
      "You are not authorized to publish this quiz.",
      httpStatusCode.FORBIDDEN,
    );
  }

  const filters: SQL[] = [
    eq(quizTable.id, quizId),
    eq(quizTable.teacher_id, req.user.id),
  ];

  const quiz = await editQuiz(filters, { is_published: true });
  if (!quiz) {
    throw new ApiError("Quiz does not exist.", httpStatusCode.BAD_REQUEST);
  }

  return sendResponse(
    res,
    httpStatusCode.OK,
    httpStatus.SUCCESS,
    "The quiz has been published successfully.",
  );
});

export const updateQuiz = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, quizId } = req.body;

  if (req.user.role !== "teacher") {
    throw new ApiError(
      "You are not authorized to update this quiz.",
      httpStatusCode.FORBIDDEN,
    );
  }

  const filters: SQL[] = [
    eq(quizTable.id, quizId),
    eq(quizTable.teacher_id, req.user.id),
  ];

  const quiz = await editQuiz(filters, { title, description });
  if (!quiz) {
    throw new ApiError("Quiz does not exist.", httpStatusCode.BAD_REQUEST);
  }

  return sendResponse(
    res,
    httpStatusCode.OK,
    httpStatus.SUCCESS,
    `The quiz '${quiz.title}' has been updated successfully.`,
  );
});
export const getQuiz = asyncHandler(async (req: Request, res: Response) => {
  const { search, page, perRow } = req.query;

  const offset = skip(parseInt(page as string), parseInt(perRow as string));

  const filters: SQL[] = [eq(quizTable.teacher_id, req.user.id)];

  if (req.user.role !== "teacher") {
    throw new ApiError(
      "You are not authorized to get this quiz",
      httpStatusCode.FORBIDDEN,
    );
  }

  if (search) {
    filters.push(ilike(quizTable.title, `%${search}%`));
  }

  const quizzes = await searchQuiz(filters, offset, parseInt(perRow as string));

  return sendResponse(
    res,
    httpStatusCode.OK,
    httpStatus.SUCCESS,
    "Quizzes fetched successfully",
    quizzes,
  );
});

export const createQuiz = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    subject,
    difficulty,
    showAnswers,
    timeLimit,
    maxAttempts,
  } = req.body;

  const quiz = await createNewQuiz({
    title,
    description,
    difficulty,
    time_limit_seconds: timeLimit,
    show_answers_after_submission: showAnswers,
    subject,
    attempts_allowed: maxAttempts,
    teacher_id: req.user.id,
  });

  if (!quiz) {
    throw new ApiError(
      "Failed to create quiz",
      httpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }

  return sendResponse(
    res,
    httpStatusCode.OK,
    httpStatus.SUCCESS,
    "Quiz created successfully",
  );
});
