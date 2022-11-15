import { Router } from 'express';
import { safeExecuteRoute } from '../../helpers/responses';
import { articlesController } from './articles.controller';

export const articlesRoutes = (): Router => {
  const articles: Router = Router({ mergeParams: true });

  articles.get('/:id', safeExecuteRoute(articlesController.getArticles));
  
  articles.get('/list-by-category/:id', safeExecuteRoute(articlesController.getArticlesByCategory));
  
  articles.post('/create', safeExecuteRoute(articlesController.createArticle));

  articles.put('/edit/:id', safeExecuteRoute(articlesController.editArticle));

  articles.put('/like/:id', safeExecuteRoute(articlesController.likeArticle));

  articles.delete('/:id', safeExecuteRoute(articlesController.deleteArticle));

  return articles;
}