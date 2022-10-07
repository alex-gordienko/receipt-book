import express from 'express';
import { Db } from 'mongodb';
import { config } from '../config';

const logRequestMiddleware = async (
    req: express.Request,
    loggerPool: Db
  ) => {
  const requestLog = {
    method: req.method,
    path: req.path,
    clientAddress: req.headers['x-forwarded-for'] || null,
    query: req.query ?? undefined,
    params: req.params ?? undefined,
    body: req.body,
    reqestDate: new Date()
  };
  await loggerPool
    .collection(config.databases['logger'].collections['requests'])
    .insertOne(requestLog);
};

export default logRequestMiddleware;