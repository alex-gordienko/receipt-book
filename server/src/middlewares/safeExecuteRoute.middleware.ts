import { RequestHandler, Request, Response, NextFunction } from "express";
import { RequestError } from "../helpers/responses";

const isRequestError = (error: unknown): error is RequestError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'statusCode' in error &&
    (typeof (error as Record<string, unknown>).message === 'string' || typeof (error as Record<string, unknown>).message === 'object') &&
    typeof (error as Record<string, unknown>).statusCode === 'number'
  )
}

export const safeExecuteRoute = (cb: RequestHandler<any, any, any, any>): (req: Request, res: Response, next: NextFunction) => Promise<void> => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      let statusCode = 500;
      let statusMessage = 'Failed';
      let message = 'Something went wrong';
      console.log(err);
      if (isRequestError(err)) {
        statusMessage = err.name;
        statusCode = err.statusCode;
        message = err.message;
      }
      console.log({statusCode, statusMessage, message});
      res.statusMessage = statusMessage;
      res.status(statusCode).send(message);
    }
  }
}