import { httpStatus, httpStatusCode } from "@customtype/http";
import { addQuestionReqBody } from "@customtype/quiz/questions";
import { getQuizById } from "@services/quiz-service";
import ApiError from "@utils/api-error";
import asyncHandler from "@utils/async-handlar";
import { sendResponse } from "@utils/base-response";
import { checkIsValidTeacher, isTeacherRequest } from "@utils/index";
import {
  db,
  NewQuestion,
  NewQuestionOption,
  questionOptionsTable,
  questionsTable,
  TransactionRollbackError,
} from "@workspace/db";
import type { Request, Response } from "express";

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
