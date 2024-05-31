import { NextFunction, Request, Response } from "express";
import { ErrorCode, HtppException } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exception";

export const errorHandler = (
  method: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HtppException;
      if (error instanceof HtppException) {
        exception = error;
      } else {
        exception = new InternalException(
          "Something went wrong!",
          error,
          ErrorCode.INTERNAL_EXCEPTION
        );
      }
      return next(exception);
    }
  };
};
