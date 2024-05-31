import { NextFunction, Request, Response } from "express";
import { HtppException } from "../exceptions/root";

export const errorMiddleware = (
  error: HtppException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
    errors: error.errors,
  });
};
