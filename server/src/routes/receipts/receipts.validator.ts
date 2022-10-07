import Joi from 'joi';
import { ObjectId, WithId } from 'mongodb';
import { badRequest, validationError } from '../../helpers/responses';
import { isValidObjectID } from '../../validators/mongo-id.validator';
import { receiptsModel } from './receipts.models';

export const createReceiptSchema = Joi.object<receipts.IReceiptCreate>({
  title: Joi.string().required(),
  description: Joi.string().required(),
  categoryId: Joi.string().required()
});

export const editReceiptSchema = Joi.object<receipts.IReceiptEdit>({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  categoryId: Joi.string().optional()
});

export const validateCreationReceipt = async (reqBody: receipts.IReceiptCreate): Promise<WithId<categories.IDBCategory>> => {
  const validationResult = createReceiptSchema.validate(reqBody);

  if (validationResult.error) {
    throw validationError(validationResult.error?.details)
  }

  if (!isValidObjectID(reqBody.categoryId)) {
      throw badRequest('Category Id is incorrect');
  }

  return receiptsModel.checkReceiptCategory(new ObjectId(reqBody.categoryId));
}

export const validateEditReceipt = async (reqBody: receipts.IReceiptEdit): Promise<boolean> => {
  const validationResult = editReceiptSchema.validate(reqBody);

  if (validationResult.error) {
    throw validationError(validationResult.error?.details);
  }

  if (reqBody.categoryId) {
    if (!isValidObjectID(reqBody.categoryId)) {
      throw badRequest('Category Id is incorrect');
    }

    await receiptsModel.checkReceiptCategory(new ObjectId(reqBody.categoryId));
  }
  return true
}