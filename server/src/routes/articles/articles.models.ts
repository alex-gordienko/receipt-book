import { ObjectId, WithId } from "mongodb";
import { notFound } from "../../helpers/responses";
import { useDatabase } from "../../hooks/useDatabase";
import { categoryModel } from '../categories/categories.models'

class ArticlesModel {
  public async findById (id: ObjectId): Promise<WithId<articles.IDBArticles> | null> {
    return useDatabase.articlesDatabase.findOne({ _id: id });
  }
  public async findByIdWithCheck(id: ObjectId): Promise<WithId<articles.IDBArticles>> {
    const article = await this.findById(id);

    if (!article) {
      throw notFound(`Can't find article by ID = ${id}`);
    }

    return article
  }
  public async findByName (title: string): Promise<WithId<articles.IDBArticles>> {
    const article = await useDatabase.articlesDatabase.findOne({ title });

    if (!article) {
      throw notFound(`Can't find article by title = ${title}`);
    }
    return article
  }
  public async listByCategory (categoryId: ObjectId, reqPage?: string, reqPageSize?: string) {
    const page = Number(reqPage || 0);
    const pageSize = Number(reqPageSize || 20);

    const articlesCount = await useDatabase.articlesDatabase.countDocuments({ categoryId });
    const articles = await useDatabase.articlesDatabase
      .find({ categoryId })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    
    return {
      items: articles,
      totalCount: articlesCount
    }
  }
  public async checkArticleCategory (categoryId: ObjectId) {
    return categoryModel.findByIdWithCheck(categoryId);
  }
  public async createNewArticle(article: articles.IArticleCreate, categoryId: ObjectId): Promise<WithId<articles.IDBArticles>> {
    const newArticleData = {
      ...article,
      categoryId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const newArticle = await useDatabase.articlesDatabase.insertOne(newArticleData);
    return { ...newArticleData, _id: new ObjectId(newArticle.insertedId) }
  }
  public async updateArticle (article: WithId<articles.IDBArticles>, dataToUpdate: articles.IArticleEdit) {
    const updated = await useDatabase.articlesDatabase.updateOne(
      { _id: article._id },
      { $set: {
        ...dataToUpdate,
        categoryId: dataToUpdate.categoryId ? new ObjectId(dataToUpdate.categoryId) : article.categoryId,
        updatedAt: new Date()
      }}
    );
    return updated
  }
  public async deleteArticle(receiptId: ObjectId) {
    const deleteArticle = await useDatabase.articlesDatabase.deleteOne({ _id: receiptId });

    return deleteArticle
  }
  public async deleteArticlesByCategoryId(categoryId: ObjectId) {
    return useDatabase.articlesDatabase.deleteMany({ categoryId });
  }
}

export const articlesModel = new ArticlesModel();