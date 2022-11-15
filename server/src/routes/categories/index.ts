import { Router } from 'express';
import { safeExecuteRoute } from '../../helpers/responses';
import { categoryController } from './categories.controller';

export const categoryRoutes = (): Router => {
  const categories: Router = Router({ mergeParams: true });

  categories.get('/list', safeExecuteRoute(categoryController.listCategories));

  categories.get('/:id', safeExecuteRoute(categoryController.getCategory));
  
  categories.post('/create', safeExecuteRoute(categoryController.createCategory));

  categories.put('/edit/:id', safeExecuteRoute(categoryController.editCategory));

  categories.put('/like/:id', safeExecuteRoute(categoryController.likeCategory));

  categories.delete('/:id', safeExecuteRoute(categoryController.deleteCategory));

  return categories;
}