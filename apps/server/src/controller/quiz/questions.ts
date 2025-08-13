import { httpStatus, httpStatusCode } from "@customtype/http";
import {
  addQuestionReqBody,
  updateQuestionReqBody,
} from "@customtype/quiz/questions";
import { deleteQuestion } from "@services/question-service";
import {
  getQuizById,
  getQuizForStudent,
  getQuizQuestionsByQuizId,
} from "@services/quiz-service";
import ApiError from "@utils/api-error";
import asyncHandler from "@utils/async-handlar";
import { sendResponse } from "@utils/base-response";
import { checkIsValidTeacher, isTeacherRequest } from "@utils/index";
import logger from "@utils/logger";
import {
  and,
  db,
  eq,
  NewQuestion,
  NewQuestionOption,
  questionOptionsTable,
  questionsTable,
  TransactionRollbackError,
} from "@workspace/db";
import type { Request, Response } from "express";

export const getQuizQuestionsForStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const { quizId } = req.params;
    if (!quizId || typeof quizId !== "string") {
      throw new ApiError("Invalid quiz id", httpStatusCode.BAD_REQUEST);
    }

    logger.info(req.user);

    if (req.user.role != "student") {
      throw new ApiError("You are not allowed.", httpStatusCode.BAD_REQUEST);
    }

    const quiz = await getQuizById(quizId);

    if (!quiz?.is_published) {
      throw new ApiError("Quiz is not published", httpStatusCode.BAD_REQUEST);
    }

    const questions = await getQuizForStudent(quizId);
    if (!questions) {
      throw new ApiError("Something went wrong", httpStatusCode.BAD_REQUEST);
    }

    return sendResponse(
      res,
      httpStatusCode.OK,
      httpStatus.SUCCESS,
      "Questions fetched successfully",
      {
        questions,
        quiz,
      },
    );
  },
);

export const deleteQuizQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const { quizId, questionId } = req.params;
    if (!quizId || typeof quizId !== "string") {
      throw new ApiError("Invalid quiz id", httpStatusCode.BAD_REQUEST);
    }
    if (!questionId || typeof questionId !== "string") {
      throw new ApiError("Invalid question id", httpStatusCode.BAD_REQUEST);
    }

    isTeacherRequest(req);

    const isQuizExist = await getQuizById(quizId);

    if (!isQuizExist) {
      throw new ApiError("Quiz does not exist.", httpStatusCode.BAD_REQUEST);
    }

    checkIsValidTeacher(req, isQuizExist);

    const isDeleted = await deleteQuestion(questionId);
    if (!isDeleted) {
      throw new ApiError(
        "Failed to delete question",
        httpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
    return sendResponse(
      res,
      httpStatusCode.OK,
      httpStatus.SUCCESS,
      "Question deleted successfully",
    );
  },
);

export const getQuizQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const { quizId } = req.params;
    if (!quizId || typeof quizId !== "string") {
      throw new ApiError("Invalid quiz id", httpStatusCode.BAD_REQUEST);
    }

    isTeacherRequest(req);

    const questions = await getQuizQuestionsByQuizId(quizId);

    return sendResponse(
      res,
      httpStatusCode.OK,
      httpStatus.SUCCESS,
      "Question fetched successfully.",
      questions,
    );
  },
);

export const updateQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const { question, questionId } = req.body as updateQuestionReqBody;
    const { quizId } = req.params;
    if (!quizId || typeof quizId !== "string") {
      throw new ApiError("Invalid quiz id", httpStatusCode.BAD_REQUEST);
    }

    isTeacherRequest(req);

    const isQuizExist = await getQuizById(quizId);

    if (!isQuizExist) {
      throw new ApiError("Quiz does not exist.", httpStatusCode.BAD_REQUEST);
    }

    checkIsValidTeacher(req, isQuizExist);

    await db.transaction(async (trx) => {
      try {
        const updateQuestion = await trx
          .update(questionsTable)
          .set(question)
          .where(
            and(
              eq(questionsTable.id, questionId),
              eq(questionsTable.quiz_id, quizId),
            ),
          );
        if (updateQuestion.rowCount === 0) {
          throw trx.rollback();
        }

        await trx
          .delete(questionOptionsTable)
          .where(eq(questionOptionsTable.question_id, questionId));

        const optionsWithQuestionId = question.options.map((option) => ({
          ...option,
          question_id: questionId,
        }));

        await trx.insert(questionOptionsTable).values(optionsWithQuestionId);
      } catch (error: any) {
        if (error instanceof TransactionRollbackError) {
          throw new ApiError(
            "Please provide question id with their options",
            httpStatusCode.BAD_REQUEST,
          );
        }
        throw new ApiError(error.message, httpStatusCode.BAD_REQUEST);
      }
    });

    return sendResponse(
      res,
      httpStatusCode.OK,
      httpStatus.SUCCESS,
      "Question updated successfully",
    );
  },
);

export const createQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const { questions } = req.body as addQuestionReqBody;
    const { quizId } = req.params;
    if (!quizId || typeof quizId !== "string") {
      throw new ApiError("Invalid quiz id", httpStatusCode.BAD_REQUEST);
    }

    isTeacherRequest(req);

    const isQuizExist = await getQuizById(quizId);

    if (!isQuizExist) {
      throw new ApiError("Quiz does not exist.", httpStatusCode.BAD_REQUEST);
    }

    checkIsValidTeacher(req, isQuizExist);

    await db.transaction(async (trx) => {
      try {
        const questionData: NewQuestion[] = [];
        const optionsData: NewQuestionOption[] = [];

        // Prepare question data
        questions.map((question) => {
          questionData.push({ ...question, quiz_id: quizId });
        });

        // Insert questions and get their IDs
        const addAllQuestion = await trx
          .insert(questionsTable)
          .values(questionData)
          .returning({ id: questionsTable.id });

        if (addAllQuestion.length !== questions.length) {
          throw trx.rollback();
        }

        // Prepare options data with the corresponding question_id
        questions.forEach((question, index) => {
          // Get the inserted question ID
          const questionId = addAllQuestion[index]?.id;

          if (!questionId) {
            throw trx.rollback();
          }

          // Assuming question.options is an array of options for this question
          if (Array.isArray(question.options)) {
            question.options.forEach((option) => {
              optionsData.push({
                ...option,
                question_id: questionId, // Add the question_id to each option
              });
            });
          }
        });

        // Now insert the options
        if (optionsData.length > 0) {
          await trx.insert(questionOptionsTable).values(optionsData);
        }

        return { success: true };
      } catch (error: any) {
        if (error instanceof TransactionRollbackError) {
          throw new ApiError(
            "Something went wrong",
            httpStatusCode.BAD_REQUEST,
          );
        } else {
          throw new ApiError(error.message, httpStatusCode.BAD_REQUEST);
        }
      }
    });

    return sendResponse(
      res,
      httpStatusCode.OK,
      httpStatus.SUCCESS,
      "Question added successfully",
    );
  },
);
