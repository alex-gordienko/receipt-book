import { RequestHandler } from 'express';
import { ObjectId, UpdateResult, WithId } from 'mongodb';
import { articlesModel } from './articles.models';
import { badRequest } from '../../helpers/responses';
import { validateCreationArticle, validateEditArticle } from './articles.validator';
import { isValidObjectID } from '../../validators/mongo-id.validator';

type GetArticles = RequestHandler<{ id: string }, WithId<articles.IDBArticles>, {}, {}>;
type GetArticlesOfCategory = RequestHandler<{ id: string }, { totalCount: number; items: WithId<articles.IDBArticles>[] }, {}, { page: string, pageSize: string }>;
type CreateArticle = RequestHandler<{}, WithId<articles.IDBArticles>, articles.IArticleCreate, {}>;
type EditArticle = RequestHandler<{ id: string }, UpdateResult, articles.IArticleEdit, {}>;
type DeleteArticle = RequestHandler<{ id: string }, {}, {}, {}>;

class ArticlesController {
  public getArticles: GetArticles = async (req, res) => {

    if (!isValidObjectID(req.params.id)) {
      throw badRequest('Article Id is incorrect');
    }
  
    const article = await articlesModel.findByIdWithCheck(new ObjectId(req.params.id));
    res.send(article);
  };

  public getArticlesByCategory: GetArticlesOfCategory = async (req, res) => {
    if (!isValidObjectID(req.params.id)) {
      throw badRequest('Category Id is incorrect');
    }

    const result = await articlesModel.listByCategory(new ObjectId(req.params.id), req.query.page, req.query.pageSize);
    res.send(result);
  };

  public createArticle: CreateArticle = async (req, res) => {
    const requestArticle = req.body as articles.IArticleCreate;
    
    const validCategory = await validateCreationArticle(requestArticle);

    const newArticle = await articlesModel.createNewArticle(requestArticle, validCategory._id);

    res.status(200).send(newArticle);
  }

  public editArticle: EditArticle = async (req, res) => {
    if (!isValidObjectID(req.params.id)) {
      throw badRequest('Receipt Id should be provided');
    }

    const articleId = new ObjectId(req.params.id);
    const requestArticle = req.body as articles.IArticleEdit;

    const isArticleExists = await validateEditArticle(articleId, requestArticle);

    const editedReceipt = await articlesModel.updateArticle(isArticleExists, requestArticle);

    res.status(200).send(editedReceipt);
  }

  public deleteArticle: DeleteArticle = async (req, res) => {

    if (!isValidObjectID(req.params.id)) {
      throw badRequest('Receipt Id should be provided');
    }

    const articleId = new ObjectId(req.params.id);

    const deleteReceipt = await articlesModel.deleteArticle(articleId);

    res.status(200).send(deleteReceipt);
  }
}

export const articlesController = new ArticlesController();