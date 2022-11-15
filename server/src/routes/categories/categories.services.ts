import { ObjectId, WithId } from 'mongodb';
import { badRequest } from "../../helpers/responses";
import { useDatabase } from '../../hooks/useDatabase';
import { categoriesEvents } from './categories.events';
import { categoryModel } from './categories.models';

class CategoriesService {

  public async checkBeforeUpdate(categoryId: ObjectId, parentId: ObjectId) {
    const newCategoryPosition = await categoryModel.getChainListOfCategory(parentId.toString());

    if (!newCategoryPosition || newCategoryPosition.includes(categoryId.toString())) {
      throw badRequest('Try to assign parent category to his child');
    }

    categoriesEvents.reIndexCategory(categoryId.toString())
  }

  public async processCategoryDeletion(categoryId: ObjectId) {
    const categoryToDelete = await categoryModel.findByIdWithCheck(categoryId);
    await categoryModel.archiveCategory(categoryId);
    await useDatabase.categoriesDatabase.updateMany(
      { parentId: categoryToDelete._id },
      { $set: { parentId: categoryToDelete.parentId } }
    );
    categoriesEvents.lazyDeleteCategory(categoryId.toString());
  }

  public async findChildrensByCategoryId(categoryId: ObjectId): Promise<WithId<categories.IDBCategory>[]> {
    return useDatabase.categoriesDatabase.find({ parentId: categoryId }).toArray();
  }

}

export const categoriesService = new CategoriesService();