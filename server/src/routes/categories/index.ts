import { Router } from 'express';
import { checkUserAccess } from '../../middlewares/checkUserAccess.middleware';
import { parseBearerToken } from '../../middlewares/parseToken.middleware';
import { safeExecuteRoute } from '../../middlewares/safeExecuteRoute.middleware';
import { categoryController } from './categories.controller';

export const categoryRoutes = (): Router => {
  const categories: Router = Router({ mergeParams: true });

  categories.get('/list', safeExecuteRoute(parseBearerToken(checkUserAccess(categoryController.listCategories))));

  categories.get('/:id', safeExecuteRoute(parseBearerToken(checkUserAccess(categoryController.getCategory))));
  
  categories.post('/create', safeExecuteRoute(parseBearerToken(checkUserAccess(categoryController.createCategory))));

  categories.put('/edit/:id', safeExecuteRoute(parseBearerToken(checkUserAccess(categoryController.editCategory))));

  categories.put('/like/:id', safeExecuteRoute(parseBearerToken(checkUserAccess(categoryController.likeCategory))));

  categories.delete('/:id', safeExecuteRoute(parseBearerToken(checkUserAccess(categoryController.deleteCategory))));

  return categories;
}