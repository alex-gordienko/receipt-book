import Joi from 'joi';
import { ObjectId, WithId } from 'mongodb';
import { badRequest, validationError } from '../../helpers/responses';
import { isValidObjectID } from '../../validators/mongo-id.validator';
import { articlesModel } from './articles.models';

export const createArticleSchema = Joi.object<articles.IArticleCreate>({
  title: Joi.string().required(),
  shortDescription: Joi.string().required(),
  longDescription: Joi.string().required(),
  categoryId: Joi.string().required()
});

export const editArticleSchema = Joi.object<articles.IArticleEdit>({
  title: Joi.string().optional(),
  shortDescription: Joi.string().optional(),
  longDescription: Joi.string().optional(),
  categoryId: Joi.string().optional()
});

export const validateCreationArticle = async (reqBody: articles.IArticleCreate): Promise<WithId<categories.IDBCategory>> => {
  const validationResult = createArticleSchema.validate(reqBody);

  if (validationResult.error) {
    throw validationError(validationResult.error?.details)
  }

  if (!isValidObjectID(reqBody.categoryId)) {
    throw badRequest('Category Id is incorrect');
  }

  return articlesModel.checkArticleCategory(new ObjectId(reqBody.categoryId));
}

export const validateEditArticle = async (articleId: ObjectId, reqBody: articles.IArticleEdit): Promise<WithId<articles.IDBArticles>> => {
  const validationResult = editArticleSchema.validate(reqBody);

  if (validationResult.error) {
    throw validationError(validationResult.error?.details);
  }

  const isArticleExists = await articlesModel.findByIdWithCheck(articleId);

    if (reqBody.categoryId) {
      if (!isValidObjectID(reqBody.categoryId)) {
        throw badRequest('Category Id is incorrect');
      }

      await articlesModel.checkArticleCategory(new ObjectId(reqBody.categoryId))
    }
  return isArticleExists
}