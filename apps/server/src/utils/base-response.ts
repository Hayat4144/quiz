import { httpStatus } from "@customtype/http";
import { Response } from "express";

export interface dtoInterface {
  statusCode: number;
  status: httpStatus;
  message: string;
  // eslint-disable-next-line
  data?: any;
}

export function sendResponse(
  res: Response,
  statusCode: number,
  status: httpStatus,
  message: string,
  // eslint-disable-next-line
  data?: any,
): Response {
  const dto: dtoInterface = { statusCode, status, message };

  if (data) dto.data = data;
  return res.status(statusCode).json(dto);
}
