import { Request, Response, NextFunction, RequestHandler } from "express";
import * as jwt from 'jsonwebtoken';
import { secret } from "../config";
import { badRequest, unauthorized } from "../helpers/responses";


export const parseBearerToken = (cb: RequestHandler<any, any, any, any>): (req: Request, res: Response, next: NextFunction) => Promise<void> => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.originalUrl);
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
    
      try {
        const result = await jwt.verify(bearerToken, secret, { algorithms: ['RS256'] });
        console.log(result);
        const encryptedResult = result as { id: string, iat: number, exp: number };
      
        req.user = {
          id: encryptedResult.id
        }
        return cb(req, res, next);
      } catch (err) {
        console.error(err);
        throw badRequest('Error while verify token');
      }
    }
    if (req.originalUrl !== '/user' && req.originalUrl !== '/user/create' && req.method !== 'POST') {
      return unauthorized('Access denied')
    }
    return cb(req, res, next);
  }
}