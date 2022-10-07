import { ObjectId, WithId } from 'mongodb';
import { notFound } from '../../helpers/responses';
import { useDatabase } from '../../hooks/useDatabase';

class CategoriesModel {

  public async findById (id: ObjectId): Promise<WithId<categories.IDBCategory> | null> {
    return useDatabase.categoriesDatabase.findOne({ _id: id, $or: [{ status: { $exists: false } }, { status: 'active' }] });
  }
  public async findByIdWithCheck (id: ObjectId): Promise<WithId<categories.IDBCategory>> {
    const category = await this.findById(id);

    if (!category) {
      throw notFound(`Can't find category by ID = ${id}`);
    }
    return category
  }

  public async findByName(title: string): Promise<WithId<categories.IDBCategory> | null> {
    return useDatabase.categoriesDatabase.findOne({ title });
  }

  public async findByNameWithCheck (title: string): Promise<WithId<categories.IDBCategory>> {
    const category = await this.findByName(title);

    if (!category) {
      throw notFound(`Can't find category by title = ${title}`);
    }

    return category
  }

  public async listCategories(): Promise<WithId<categories.IDBCategory>[]> {
    const searchResult = await useDatabase.categoriesDatabase.find({ $or: [{ status: { $exists: false } }, { status: 'active' }] }).toArray();
    
    return searchResult.map((category: WithId<categories.IDBCategory>) => ({...category, status: category.status || 'active'}))
  }

  public async createNewCategory(category: categories.ICategoryCreate): Promise<WithId<categories.IDBCategory>> {
    const createCategoryData = {
      ...category,
      parentId: category.parentId ? new ObjectId(category.parentId) : null,
      status: 'active' as 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const newCategory = await useDatabase.categoriesDatabase.insertOne(createCategoryData);
    return { ...createCategoryData, _id: newCategory.insertedId }
  }
  public async getChainListOfCategory(categoryId: string): Promise<string[]> {
    return useDatabase.redisClient.lRange(categoryId, 0, -1);
  }

  public async updateCategory(category: WithId<categories.IDBCategory>, dataToUpdate: categories.ICategoryEdit) {
    const updated = await useDatabase.categoriesDatabase.updateOne(
      { _id: category._id },
      { $set: {
        ...dataToUpdate,
        status: category.status || 'active',
        parentId: dataToUpdate.parentId ? new ObjectId(dataToUpdate.parentId) : category.parentId,
        updatedAt: new Date()
      }}
    );
    return updated
  }
  public async archiveCategory(categoryId: ObjectId) {
    return useDatabase.categoriesDatabase.updateOne({ _id: categoryId }, { $set: {status: 'archived'}});
  }
  public async deleteCategory(categoryId: ObjectId) {
    return useDatabase.categoriesDatabase.deleteOne({ _id: categoryId });
  }
}

export const categoryModel = new CategoriesModel();