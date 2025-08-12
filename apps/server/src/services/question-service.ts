import { httpStatusCode } from "@customtype/http";
import ApiError from "@utils/api-error";
import logger from "@utils/logger";
import {
  db,
  eq,
  questionOptionsTable,
  questionsTable,
  TransactionRollbackError,
} from "@workspace/db";

export const deleteQuestion = async (questionId: string) => {
  try {
    return await db.transaction(async (trx) => {
      const [questionDeletion, optionsDeletion] = await Promise.all([
        trx.delete(questionsTable).where(eq(questionsTable.id, questionId)),
        trx
          .delete(questionOptionsTable)
          .where(eq(questionOptionsTable.question_id, questionId)),
      ]);

      if (questionDeletion.rowCount === 0) {
        throw trx.rollback();
      }

      // Note: You might want to skip this check if options are optional
      if (optionsDeletion.rowCount === 0) {
        logger.warn(`No options found for question ${questionId}`);
      }

      return true;
    });
  } catch (error: any) {
    // Handle specific error cases
    if (error instanceof TransactionRollbackError) {
      // Handle other errors
      throw new ApiError(
        error.message || "Failed to delete question",
        httpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
    throw error;
  }
};
