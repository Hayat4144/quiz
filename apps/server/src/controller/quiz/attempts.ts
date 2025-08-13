import { httpStatus, httpStatusCode } from "@customtype/http";
import { AnswerPayload } from "@customtype/quiz/attempts";
import {
  createAttempt,
  getAllAttempts,
  getAttempts,
} from "@services/attempt-service";
import ApiError from "@utils/api-error";
import asyncHandler from "@utils/async-handlar";
import { sendResponse } from "@utils/base-response";
import {
  attemptAnswersTable,
  attemptsTable,
  db,
  eq,
  inArray,
  questionOptionsTable,
  questionsTable,
} from "@workspace/db";
import type { Request, Response } from "express";

export const getQuizAttemtsForStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const { quizId } = req.params;

    if (!quizId || typeof quizId !== "string") {
      throw new ApiError("Invalid quiz id", httpStatusCode.BAD_REQUEST);
    }

    if (req.user.role == "teacher") {
      throw new ApiError(
        "You are not allowed to see report",
        httpStatusCode.BAD_REQUEST,
      );
    }

    const attempts = await getAllAttempts(quizId);
    if (!attempts) {
      throw new ApiError("Something went wrong", httpStatusCode.BAD_REQUEST);
    }

    return sendResponse(
      res,
      httpStatusCode.OK,
      httpStatus.SUCCESS,
      "Report fetched successfully",
      attempts,
    );
  },
);

export const submitAttempt = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { attemptId } = req.params;
    const { answers } = req.body as { answers: AnswerPayload[] };
    const userId = req.user.id;

    if (!attemptId || typeof attemptId !== "string") {
      throw new ApiError("Invalid attempt id", httpStatusCode.BAD_REQUEST);
    }

    // Validate attempt belongs to user
    const attempt = await getAttempts(attemptId);
    if (!attempt.length || attempt[0]?.user_id !== userId) {
      throw new ApiError("You are not allowed.", httpStatusCode.BAD_REQUEST);
    }

    let totalScore = 0;
    let maxScore = 0;

    await db.transaction(async (tx) => {
      const questionIds = answers.map((a) => a.questionId);

      // Fetch correct answers & points
      const questionList = await tx
        .select()
        .from(questionsTable)
        .where(inArray(questionsTable.id, questionIds));

      const optionList = await tx
        .select()
        .from(questionOptionsTable)
        .where(inArray(questionOptionsTable.question_id, questionIds));

      for (const ans of answers) {
        const question = questionList.find((q) => q.id === ans.questionId);
        if (!question) continue;

        const correctOption = optionList.find(
          (o) => o.question_id === ans.questionId && o.is_correct,
        );

        const isCorrect = ans.selectedOptionId === correctOption?.id;

        const pointsAwarded = isCorrect ? (question.points as number) : 0;

        totalScore += pointsAwarded;
        maxScore += question.points as number;

        await tx.insert(attemptAnswersTable).values({
          attempt_id: attemptId,
          question_id: ans.questionId,
          selected_option_id: ans.selectedOptionId,
          text_answer: null,
          is_correct: isCorrect,
          points_awarded: pointsAwarded,
        });
      }

      // Update attempt score
      if (attempt[0]) {
        await tx
          .update(attemptsTable)
          .set({
            submitted_at: new Date(),
            duration_seconds: Math.floor(
              (Date.now() - attempt[0].started_at.getTime()) / 1000,
            ),
            score: totalScore,
            max_score: maxScore,
          })
          .where(eq(attemptsTable.id, attemptId));
      }
    });

    res.status(httpStatusCode.OK).json({
      message: "Attempt submitted successfully",
      score: totalScore,
      maxScore,
    });
  },
);

export const startAttempt = asyncHandler(
  async (req: Request, res: Response) => {
    const { quizId } = req.body;
    const userId = req.user.id;

    if (!quizId || typeof quizId !== "string") {
      throw new ApiError("Invalid quiz id", httpStatusCode.BAD_REQUEST);
    }

    const attempt = await createAttempt({ quiz_id: quizId, user_id: userId });
    if (!attempt || !attempt.id) {
      throw new ApiError(
        "Failed to create attempt",
        httpStatusCode.BAD_REQUEST,
      );
    }

    return sendResponse(
      res,
      httpStatusCode.OK,
      httpStatus.SUCCESS,
      "Your quiz attempt started successfully",
      attempt,
    );
  },
);
