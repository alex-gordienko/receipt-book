import { ObjectId, WithId } from "mongodb";
import LikeBuffer from "../../buffer/likes.buffer";
import { handleCashedData, handleOverwriteCache, notFound } from "../../helpers/responses";
import { useDatabase } from "../../hooks/useDatabase";
import { categoryModel } from '../categories/categories.models'

export class ArticlesModel {
  private likesController = new LikeBuffer('article');
  
  @handleCashedData('article', 50)
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

  @handleCashedData('article', 50)
  public async findByName (title: string): Promise<WithId<articles.IDBArticles>> {
    const article = await useDatabase.articlesDatabase.findOne({ title });

    if (!article) {
      throw notFound(`Can't find article by title = ${title}`);
    }
    return article
  }

  @handleCashedData('article', 50)
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

  @handleOverwriteCache('article')
  public async createNewArticle(article: articles.IArticleCreate, categoryId: ObjectId): Promise<WithId<articles.IDBArticles>> {
    const newArticleData = {
      ...article,
      categoryId,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const newArticle = await useDatabase.articlesDatabase.insertOne(newArticleData);

    return { ...newArticleData, _id: new ObjectId(newArticle.insertedId) }
  }

  @handleOverwriteCache('article')
  public async updateArticle (article: WithId<articles.IDBArticles>, dataToUpdate: articles.IArticleEdit) {
    await useDatabase.articlesDatabase.updateOne(
      { _id: new ObjectId(article._id) },
      { $set: {
        ...dataToUpdate,
        categoryId: dataToUpdate.categoryId ? new ObjectId(dataToUpdate.categoryId) : article.categoryId,
        updatedAt: new Date()
      }}
    );
    const updatedResult = (await useDatabase.articlesDatabase.findOne({ _id: new ObjectId(article._id) }))!
    return updatedResult;
  }

  @handleOverwriteCache('article')
  public async likeArticle (articleId: string) {
    await this.likesController.like(articleId);
  }

  @handleOverwriteCache('article')
  public async deleteArticle(articleId: ObjectId) {
    const deleteArticle = await useDatabase.articlesDatabase.deleteOne({ _id: articleId });

    return deleteArticle
  }
  
  @handleOverwriteCache('article')
  public async deleteArticlesByCategoryId(categoryId: ObjectId) {
    return useDatabase.articlesDatabase.deleteMany({ categoryId });
  }
}

export const articlesModel = new ArticlesModel();