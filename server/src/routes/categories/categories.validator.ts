import Joi from 'joi';
import { ObjectId, WithId } from 'mongodb';
import { badRequest, validationError } from '../../helpers/responses';
import { isValidObjectID } from '../../validators/mongo-id.validator';
import { categoryModel } from './categories.models';

export const createCategorySchema = Joi.object<categories.ICategoryCreate>({
  title: Joi.string().required(),
  parentId: Joi.string().optional().allow(null)
});

export const editCategorySchema = Joi.object<categories.ICategoryEdit>({
  title: Joi.string().optional(),
  parentId: Joi.string().optional()
});

export const validateCategoryCreation = async (reqBody: categories.ICategoryCreate) => {
  const validationResult = createCategorySchema.validate(reqBody);

  if (validationResult.error) {
    throw validationError(validationResult.error?.details)
  }

  if (reqBody.parentId) {
    if (!isValidObjectID(reqBody.parentId)) {
      throw badRequest('Parent category Id is incorrect');
    }
    await categoryModel.findByIdWithCheck(new ObjectId(reqBody.parentId));
  }
}

export const validateCategoryEdit = async (categoryId: ObjectId, reqBody: categories.ICategoryEdit): Promise<WithId<categories.IDBCategory>> => {
  const validationResult = editCategorySchema.validate(reqBody);

  if (validationResult.error) {
    throw validationError(validationResult.error?.details)
  }

  const isCategoryExists = await categoryModel.findByIdWithCheck(categoryId);
  
  if (reqBody.parentId) {
    if (!isValidObjectID(reqBody.parentId)) {
      throw badRequest('Parent category Id is incorrect');
    }
    await categoryModel.findByIdWithCheck(new ObjectId(reqBody.parentId));
  }
  return isCategoryExists
}