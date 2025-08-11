import { getTableColumns, Quiz, Table } from "@workspace/db";
import type { Request } from "express";
import ApiError from "./api-error";
import { httpStatusCode } from "@customtype/http";

export const isTeacherRequest = (req: Request) => {
  if (req.user.role !== "teacher") {
    throw new ApiError(
      "You are not authorized to add question to this quiz.",
      httpStatusCode.FORBIDDEN,
    );
  }
};

export const checkIsValidTeacher = (req: Request, quiz: Partial<Quiz>) => {
  if (quiz.teacher_id !== req.user.id) {
    throw new ApiError(
      "You are not authorized to add question to this quiz.",
      httpStatusCode.FORBIDDEN,
    );
  }
};

export const getFields = <T extends Table>(
  table: T,
  ...fields: (keyof T["_"]["columns"])[]
) => {
  const allColumns = getTableColumns(table);
  return Object.fromEntries(
    fields.map((field) => [field, allColumns[field]]),
  ) as Pick<typeof allColumns, keyof typeof allColumns>;
};

export const skip = (page: number, perRow: number) => (page - 1) * perRow;
