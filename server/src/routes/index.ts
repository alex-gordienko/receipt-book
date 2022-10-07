import express from 'express';
import { useDatabase } from '../hooks/useDatabase';
import { articlesRoutes } from './articles';
import { receiptsRoutes } from './receipts';
import { categoryRoutes } from './categories';

export const Home = (
  app: express.Express,
) => {

  app.get('/', async (_req, res) => {
    const availableCollections: string[] = [];

    const collectionsDoc = await useDatabase.connectionPool
      .listCollections()
      .toArray();

    for (const collection of collectionsDoc) {
      availableCollections.push(collection.name)
    }
    
    res.send({ availableCollections });
  });

  app.use('/articles', articlesRoutes());
  app.use('/receipts', receiptsRoutes());
  app.use('/categories', categoryRoutes());
}