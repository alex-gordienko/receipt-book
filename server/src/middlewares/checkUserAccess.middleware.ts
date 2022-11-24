import { Request, Response, NextFunction, RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { unauthorized, forbidden } from "../helpers/responses";
import { useDatabase } from "../hooks/useDatabase";


export const checkUserAccess = (cb: RequestHandler<any, any, any, any>): (req: Request, res: Response, next: NextFunction) => Promise<void> => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    console.log('checkUserAccess', user, req.originalUrl, req.method);
    if (!user) {
      throw  forbidden('Forbidden to access');
    }

    const dbUser = await useDatabase.accountsDatabase.findOne({ _id: new ObjectId(user.id) });

    if (!dbUser) {
      throw unauthorized('Invalid user')
    }

    if (dbUser.isAdmin) {
      return cb(req, res, next);
    }

    if (
      (req.originalUrl !== '/user' && req.originalUrl !== '/user/create' && req.method !== 'POST') &&
      (req.originalUrl !== '/user' && req.method !== 'GET') &&
      (req.originalUrl !== '/categories/like' && req.originalUrl !== '/articles/like' && req.originalUrl !== '/receipts/like' && req.method !== 'PUT') &&
      req.method === 'DELETE'
    ) {
      console.log(req.originalUrl, req.method)
      throw forbidden('Forbidden to access');
    }

    return cb(req, res, next);
  }
}