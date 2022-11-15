import { RequestHandler, Request, Response, NextFunction } from "express";
import Joi from "joi";
import { useDatabase } from "../hooks/useDatabase";
import { ArticlesModel } from "../routes/articles/articles.models";
import { CategoriesModel } from "../routes/categories/categories.models";
import { ReceiptsModel } from "../routes/receipts/receipts.models";
import { createHash } from "./decriptor";

type ErrorReason =
  | 'BadRequest'
  | 'Unathorized'
  | 'Conflict'
  | 'Failed'
  | 'Forbidden'
  | 'NotFound'
  | 'TooManyRequests'
  | 'ValidationError';

class RequestError extends Error {
  public statusCode: number;
  public message: string;
  constructor(name: string, status: number, message: string) {
    super(name);
    this.statusCode = status;
    this.message = message;
  }
}

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

export const requestFullUrl = (req: Request): string => {
  const protocol = req.protocol;
    const host = req.hostname;
    const url = req.originalUrl;
    const port = process.env.PORT;

  return `${protocol}://${host}:${port}${url}`;
}

type ExtendObject = ArticlesModel | CategoriesModel | ReceiptsModel;

export const handleCashedData = (prefix: string, storeTime: number): any => {
  console.log(`Storing for ${storeTime} seconds`);
  return (_target: ExtendObject, name: string, descriptor: PropertyDescriptor) => {
    console.log(prefix, name, ' called');
    const original = descriptor.value;

    descriptor.value = async function (...args: any) {
      console.log('params: ', args);

      const cachedName = `${prefix}-${name}-${createHash(JSON.stringify(args), `${prefix}-${name}-${JSON.stringify(args)}`)}`;

      const cashedResult = await useDatabase.redisClient.get(cachedName);
      if (cashedResult) {
        console.log(cachedName, '- return from cache');
        return JSON.parse(cashedResult)
      }
      console.log(cachedName, '- return from database');
      const result = await original.call(this, ...args);
      useDatabase.redisClient.setEx(cachedName, storeTime, JSON.stringify(result));
      return result;
    }
  }
}

export const handleOverwriteCache = (prefix: string): any => {
  return (_target: ExtendObject, name: string, descriptor: PropertyDescriptor) => {
    console.log(prefix, name, ' called');
    const original = descriptor.value;

    descriptor.value = async function (...args: any) {
      try {
        const searchResult = await useDatabase.redisClient.keys(`${prefix}-*`);
        if (searchResult.length) {
          console.log('Delete from cache', searchResult);
          useDatabase.redisClient.del(searchResult);
        }

        const result = await original.call(this, ...args);
        return result;
      } catch (err) {
        console.log('Error in handleOverwriteCache', err);
      }
    }
  }
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

export const failed = (message: string) => {
  console.log('failed', message);
  return errorResponse(
    500,
    'Failed',
    message
  )
}

export const badRequest = (message: string) => {
  console.log('badRequest', message);
  return errorResponse(
    400,
    'BadRequest',
    message
  )
}

export const notFound = (
  message: string) => {
  console.log('notFound', message);
  return errorResponse(
    404,
    'NotFound',
    message
  )
}

export const unauthorized = (message: string) => {
  console.log('unauthorized', message);
  return errorResponse(
    401,
    'Unathorized',
    message
  )
}

export const validationError = (
  validationErrors: Joi.ValidationErrorItem[]
) => {
  console.log('validationError', validationErrors);
  const parsedErrors = validationErrors.map((joiError: Joi.ValidationErrorItem) => ({
    key: joiError.path.join('.'),
    message: joiError.message
  }))
  errorResponse(
      400,
      'ValidationError',
      parsedErrors
    )
}

export const conflict = (message?: string) => {
  console.log('conflict', message);
  return errorResponse(
    409,
    'Conflict',
    message || 'Request conflicts with the current state of the server'
  );
}

function errorResponse(
  statusCode: number,
  reason: ErrorReason,
  message: any,
) {
  throw new RequestError(reason, statusCode, message)
}