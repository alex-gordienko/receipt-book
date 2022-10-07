import EventEmitter from 'events';
import { ObjectId, WithId } from 'mongodb';
import { useDatabase } from '../../hooks/useDatabase';
import { articlesModel } from '../articles/articles.models';
import { receiptsModel } from '../receipts/receipts.models';
import { categoryModel } from './categories.models';


const processCategoryDeletion = async (categoryToDelete: string) => {
  try {
    const categoryId = new ObjectId(categoryToDelete);
    await receiptsModel.deleteReceiptsByCategoryId(categoryId);
    await articlesModel.deleteArticlesByCategoryId(categoryId);
    await categoryModel.deleteCategory(categoryId);
  } catch (err) {
    console.error(err)
  }
  console.timeEnd('delete-category');
};

const buildChainOfOneCategory = async (category: WithId<categories.IDBCategory>, categoryList: WithId<categories.IDBCategory>[]) => {
  const chainList: string[] = [category._id.toString()];
  const categoryToCheck = categoryList.find((categoryToCheck: WithId<categories.IDBCategory>) => categoryToCheck._id.equals(category._id))!;
  if (categoryToCheck.parentId) {
    chainList.push(categoryToCheck.parentId.toString());
    while (true) {
      const parent = await categoryList.find((category: WithId<categories.IDBCategory>) =>
        category._id.equals(new ObjectId(chainList[chainList.length - 1]))
      );
      console.log('parent', parent?.title);
      if (!parent || !parent.parentId) {
        break;
      }
      const parentId = parent.parentId.toString();
      if (chainList.includes(parentId)) {
        console.log('Loop Detected!');
        break;
      }
      chainList.push(parentId);
    }
  }
  console.log('Category', category.title, chainList.join(' <- '));
  useDatabase.redisClient.rPush(category._id.toString(), chainList);
}

const buildChainOfCategories = async (categoryId?: string): Promise<void> => {
  const categoryList = await useDatabase.categoriesDatabase.find().toArray();

  if (!categoryId) { 
    const categoryListKeys = categoryList.map((category) => category._id.toString());
    useDatabase.redisClient.del(categoryListKeys);

    for (const category of categoryList) {
      await buildChainOfOneCategory(category, categoryList)
    }
    console.timeEnd('index-all-categories');
    return;
  }
  const category = categoryList.find((categoryToCheck: WithId<categories.IDBCategory>) => categoryToCheck._id.equals(categoryId))!;
  useDatabase.redisClient.del(category._id.toString());
  await buildChainOfOneCategory(category, categoryList);
  console.timeEnd('re-index-category');
}

class CategoriesEvents {
  private emitter = new EventEmitter();

  constructor() {
    this.emitter.on('delete-category', processCategoryDeletion);
    this.emitter.on('start-server', buildChainOfCategories);
    this.emitter.on('re-index-category', buildChainOfCategories);
  }

  public lazyDeleteCategory(categoryId: string) {
    console.time('delete-category');
    this.emitter.emit('delete-category', categoryId);
  }
  
  public reIndexCategory(categoryId: string) {
    console.time('re-index-category');
    this.emitter.emit('re-index-category', categoryId);
  }

  public indexAllCategories() {
    console.time('index-all-categories');
    this.emitter.emit('start-server');
  }

}


export const categoriesEvents = new CategoriesEvents();