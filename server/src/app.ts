import express from 'express';
import cors from 'cors';
import { useDatabase } from './hooks/useDatabase';
import bodyParser from 'body-parser';
import { Home } from './routes';
import logRequestMiddleware from './middlewares/logger.middleware';
import { categoriesEvents } from './routes/categories/categories.events';

export const createApp = async () => {
  const app: express.Express = express();
  await useDatabase.init();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(async (req, _res, next) => {
    try {
      await logRequestMiddleware(req, useDatabase.loggerPool);
    } catch (err) {
      console.log('Something went wrong', err)
    }
    finally {
      next();
    }
  });

  categoriesEvents.indexAllCategories();

  Home(app);


  return app;
}