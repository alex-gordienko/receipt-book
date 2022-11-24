import { Router } from 'express';
import { checkUserAccess } from '../../middlewares/checkUserAccess.middleware';
import { parseBearerToken } from '../../middlewares/parseToken.middleware';
import { safeExecuteRoute } from '../../middlewares/safeExecuteRoute.middleware';
import { articlesController } from './articles.controller';

export const articlesRoutes = (): Router => {
  const articles: Router = Router({ mergeParams: true });

  articles.get('/:id', safeExecuteRoute(parseBearerToken(checkUserAccess(articlesController.getArticles))));
  
  articles.get('/list-by-category/:id', safeExecuteRoute(parseBearerToken(checkUserAccess(articlesController.getArticlesByCategory))));
  
  articles.post('/create', safeExecuteRoute(parseBearerToken(checkUserAccess(articlesController.createArticle))));

  articles.put('/edit/:id', safeExecuteRoute(parseBearerToken(checkUserAccess(articlesController.editArticle))));

  articles.put('/like/:id', safeExecuteRoute(parseBearerToken(checkUserAccess(articlesController.likeArticle))));

  articles.delete('/:id', safeExecuteRoute(parseBearerToken(checkUserAccess(articlesController.deleteArticle))));

  return articles;
}