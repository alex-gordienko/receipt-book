import { RequestHandler } from 'express';
import { ObjectId, WithId } from 'mongodb';
import { badRequest } from '../../helpers/responses';
import { validateCategoryCreation, validateCategoryEdit } from './categories.validator';
import { isValidObjectID } from '../../validators/mongo-id.validator';
import { categoryModel } from './categories.models';
import { categoriesService } from './categories.services';
import { categoriesSocketEvents } from './cetegories.socketEvents';

type GetCategory = RequestHandler<{ id: string }, WithId<categories.IDBCategory>, {}, {}>;
type ListCategoryTree = RequestHandler<{}, categories.IDBCategory[], {}, {}>;

type CreateCategory = RequestHandler<{}, WithId<categories.IDBCategory>, WithId<categories.ICategoryCreate>, {}>;
type EditCategory = RequestHandler<{ id: string }, WithId<categories.IDBCategory>, categories.ICategoryEdit, {}>;
type LikeCategory = RequestHandler<{ id: string }, {}, {}, {}>;
type DeleteCategory = RequestHandler<{ id: string }, {}, {}, {}>;

class CategoriesController {
  
  public getCategory: GetCategory = async (req, res) => {
    if (!isValidObjectID(req.params.id)) {
      throw badRequest('Category Id is incorrect');
    }
    const category = await categoryModel.findByIdWithCheck(new ObjectId(req.params.id));
    res.send(category);
  };

  public listCategories: ListCategoryTree = async (_req, res) => {
    const rawCategories = await categoryModel.listCategories();
    res.status(200).send(rawCategories)
  }

  public createCategory: CreateCategory = async (req, res) => {
    const requestCategory = req.body as categories.ICategoryCreate;

    await validateCategoryCreation(requestCategory);

    const newCategory = await categoryModel.createNewCategory(requestCategory);

    return res.status(200).send(newCategory);
  }

  public editCategory: EditCategory = async (req, res) => {

    if (!isValidObjectID(req.params.id)) {
      return badRequest('Category Id should be provided');
    }

    const categoryId = new ObjectId(req.params.id);
    const requestCategory = req.body as categories.ICategoryEdit;

    const validCategory = await validateCategoryEdit(categoryId, requestCategory);

    if (requestCategory.parentId) {
      await categoriesService.checkBeforeUpdate(categoryId, new ObjectId(requestCategory.parentId))
    }

    const editedCategory = await categoryModel.updateCategory(validCategory, requestCategory);

    categoriesSocketEvents.broadcastSendCallToUpdate(req.params.id);

    return res.status(200).send(editedCategory);
  }

  public likeCategory: LikeCategory = async (req, res) => {
    if (!isValidObjectID(req.params.id)) {
      throw badRequest('Category Id should be provided');
    }
    
    await categoryModel.likeCategory(req.params.id);

    await categoriesSocketEvents.broadcastSendCallToLike(req.params.id);

    res.sendStatus(200);
  }

  public deleteCategory: DeleteCategory = async (req, res) => {

    if (!isValidObjectID(req.params.id)) {
      return badRequest('Category Id should be provided');
    }

    const categoryId = new ObjectId(req.params.id);
    await categoriesService.processCategoryDeletion(categoryId);

    return res.status(200).send();
  }
}

export const categoryController = new CategoriesController();