import { RequestHandler } from 'express';
import { ObjectId, WithId } from 'mongodb';
import { articlesModel } from './articles.models';
import { badRequest } from '../../helpers/responses';
import { validateCreationArticle, validateEditArticle } from './articles.validator';
import { isValidObjectID } from '../../validators/mongo-id.validator';
import { articlesSocketEvents } from './articles.socketEvents';

type GetArticles = RequestHandler<{ id: string }, WithId<articles.IDBArticles>, {}, {}>;
type GetArticlesOfCategory = RequestHandler<{ id: string }, { totalCount: number; items: WithId<articles.IDBArticles>[] }, {}, { page: string, pageSize: string }>;
type CreateArticle = RequestHandler<{}, WithId<articles.IDBArticles>, articles.IArticleCreate, {}>;
type EditArticle = RequestHandler<{ id: string }, WithId<articles.IDBArticles>, articles.IArticleEdit, {}>;
type LikeArticle = RequestHandler<{ id: string }, {}, {}, {}>;
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

    articlesSocketEvents.broadcastSendCallToCreate(newArticle.categoryId.toString(), newArticle._id.toString())

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

    articlesSocketEvents.broadcastSendCallToUpdate(req.params.id);

    res.status(200).send(editedReceipt);
  }

  public likeArticle: LikeArticle = async (req, res) => {
    if (!isValidObjectID(req.params.id)) {
      throw badRequest('Article Id should be provided');
    }
    
    await articlesModel.likeArticle(req.params.id);

    articlesSocketEvents.broadcastSendCallToLike(req.params.id);

    res.sendStatus(200);
  }

  public deleteArticle: DeleteArticle = async (req, res) => {

    if (!isValidObjectID(req.params.id)) {
      throw badRequest('Article Id should be provided');
    }

    const articleId = new ObjectId(req.params.id);

    const deleteArticle = await articlesModel.deleteArticle(articleId);

    articlesSocketEvents.broadcastSendCallToDelete(req.params.id);

    res.status(200).send(deleteArticle);
  }
}

export const articlesController = new ArticlesController();