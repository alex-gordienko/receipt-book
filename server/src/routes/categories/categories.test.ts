import { setupAPI, ITestHelpers } from '../../helpers/test-helppers';
import * as faker from 'faker';
import { WithId } from 'mongodb';

let testHelper: ITestHelpers;

describe('API /categories', () => {
  const testCategoryCreate: categories.ICategoryCreate = {
    title: faker.name.title(),
    parentId: null,
  }
  let testCategory: WithId<categories.IDBCategory>;
  let testChildCategory: WithId<categories.IDBCategory>;
  const createdCategories: WithId<categories.IDBCategory>[] = [];

  let testReceipt: WithId<receipts.IDBReceipt>;
  let testArticle: WithId<articles.IDBArticles>;

  
  beforeAll(async () => {
    testHelper = await setupAPI();
    const createCategoryResponse = await testHelper.api.post('/categories/create').send(testCategoryCreate);
    testCategory = createCategoryResponse.body as WithId<categories.IDBCategory>;

    const createChildCategoryResponse = await testHelper.api.post('/categories/create').send(
      { title: faker.name.title(), parentId: testCategory._id }
    );
    testChildCategory = createChildCategoryResponse.body as WithId<categories.IDBCategory>;

    createdCategories.push(testCategory);
    createdCategories.push(testChildCategory);

    const testReceiptData: receipts.IReceiptCreate = {
      title: faker.name.title(),
      description: faker.lorem.paragraph(),
      categoryId: testCategory._id.toString()
    };
    const testArticleData: articles.IArticleCreate = {
      title: faker.name.title(),
      shortDescription: faker.lorem.sentence(),
      longDescription: faker.lorem.paragraph(),
      categoryId: testCategory._id.toString()
    };

    const testArticleResponse = await testHelper.api.post('/articles/create').send(testArticleData);
    const testReceiptResponse = await testHelper.api.post('/receipts/create').send(testReceiptData);

    testReceipt = testReceiptResponse.body as WithId<receipts.IDBReceipt>;
    testArticle = testArticleResponse.body as WithId<articles.IDBArticles>;
  });

  afterAll(async () => {
    for (const category of createdCategories) {
      await testHelper.api.delete(`/categories/${category._id.toString()}`).send();
    }
  });

  describe('GET categories', () => {
    test('Should get tree-list of categories', async () => {
      const response = await testHelper.api.get('/categories/list');
  
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(Array.isArray(response.body[0].childs)).toBeTruthy();
    });
  
    test('Should get an error if category does not exists', async () => {
      const wrongCategory = '54edb381a13ec9142b9bb353';
      const response = await testHelper.api.get(`/categories/${wrongCategory}`);
  
      expect(response.statusCode).toBe(404);
      expect(response.text).toEqual(`Can't find category by ID = ${wrongCategory}`);
    })

    test('Should get a list of receipts for selected category with pagination', async () => {
      const response = await testHelper.api.get(`/receipts/list-by-category/${testCategory._id.toString()}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('totalCount');
      expect(response.body).toHaveProperty('items');
      expect(response.body.totalCount).toBeGreaterThan(0);
      expect(response.body.items.length).toBeGreaterThan(0);

      const isReceiptExistsAndCorrectlyAssigned = !!response.body.items.find((item: WithId<categories.IDBCategory>) => testReceipt._id.toString() === item._id.toString());
      expect(isReceiptExistsAndCorrectlyAssigned).toBeTruthy();
    });

    test('Should get a list of articles for selected category with pagination', async () => {
      const response = await testHelper.api.get(`/articles/list-by-category/${testCategory._id.toString()}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('totalCount');
      expect(response.body).toHaveProperty('items');
      expect(response.body.totalCount).toBeGreaterThan(0);
      expect(response.body.items.length).toBeGreaterThan(0);

      const isArticleExistsAndCorrectlyAssigned = !!response.body.items.find((item: WithId<articles.IDBArticles>) => testArticle._id.toString() === item._id.toString());
      expect(isArticleExistsAndCorrectlyAssigned).toBeTruthy();
    })
  });

  describe('POST categories', () => {
    test('Should get an error if parent ID is incorrect', async () => {
      const createdCategory: categories.ICategoryCreate = {
        title: faker.name.title(),
        parentId: '6328138461b206ae2fa988'
      };

      const response = await testHelper.api.post('/categories/create').send(createdCategory);

      expect(response.statusCode).toBe(400);
      expect(response.text).toEqual('Parent category Id is incorrect');
    });
    
    test('Should get an error if parent is not exists', async () => {
      const createdCategory: categories.ICategoryCreate = {
        title: faker.name.title(),
        parentId: '6328138461b206ae2fa98847'
      };

      const response = await testHelper.api.post('/categories/create').send(createdCategory);

      expect(response.statusCode).toBe(404);
      expect(response.text).toEqual(`Can't find category by ID = ${createdCategory.parentId}`);
    });

    test('Should success create category', async () => {
      const createdCategory: categories.ICategoryCreate = {
        title: faker.name.title(),
        parentId: testCategory._id.toString()
      };

      const response = await testHelper.api.post('/categories/create').send(createdCategory);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('parentId');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(response.body).toHaveProperty('title');
      createdCategories.push(response.body);
     });
  });

  describe('PUT categories', () => {
    test('Should get an error if ID not provided', async () => {
      const createdCategory: categories.ICategoryCreate = {
        title: faker.name.title(),
        parentId: testCategory._id.toString()
      };

      const response = await testHelper.api.post('/categories/create').send(createdCategory);

      expect(response.statusCode).toBe(200);
      createdCategories.push(response.body);

      const editCategoryResponse = await testHelper.api.put('/categories/edit/qwert').send({ title: 'Errrrrooor' });
      expect(editCategoryResponse.statusCode).toEqual(400);
      expect(editCategoryResponse.text).toEqual('Category Id should be provided');
    });

    test('Should get an error if some field is invalid', async () => {
      const createdCategory: categories.ICategoryCreate = {
        title: faker.name.title(),
        parentId: testCategory._id.toString()
      };

      const response = await testHelper.api.post('/categories/create').send(createdCategory);

      expect(response.statusCode).toBe(200);

      const category = response.body as WithId<categories.IDBCategory>;
      createdCategories.push(category);
      
      const editCategoryResponse = await testHelper.api.put(`/categories/edit/${category._id.toString()}`).send({ title: 1234543 });
      expect(editCategoryResponse.statusCode).toEqual(400);
      expect(editCategoryResponse.body[0]).toHaveProperty('message');
      expect(editCategoryResponse.body[0].key).toEqual('title');
    });

    test('Should get an error if category is not exists', async () => {
      const errorCategory = '54edb381a13ec9142b9bb353'
      const editCategoryResponse = await testHelper.api.put(`/categories/edit/${errorCategory}`).send({ title: 'qwerty' });
      expect(editCategoryResponse.statusCode).toEqual(404);
      expect(editCategoryResponse.text).toEqual(`Can't find category by ID = ${errorCategory}`)
    });

    test('Should get an error if try to assign parent-category to his child', async () => {

      const editCategoryResponse = await testHelper.api.put(`/categories/edit/${testCategory._id.toString()}`).send({ parentId: testChildCategory._id.toString() });
      expect(editCategoryResponse.statusCode).toEqual(400);
      expect(editCategoryResponse.text).toEqual('Try to assign parent category to his child')
    });

    test('Should success edit category', async () => {
      const createdCategory: categories.ICategoryCreate = {
        title: faker.name.title(),
        parentId: testCategory._id.toString()
      };

      const response = await testHelper.api.post('/categories/create').send(createdCategory);

      expect(response.statusCode).toBe(200);

      const category = response.body as WithId<categories.IDBCategory>;
      createdCategories.push(category);

      const editCategoryResponse = await testHelper.api.put(`/categories/edit/${category._id.toString()}`).send({ title: faker.name.title()});
      expect(editCategoryResponse.statusCode).toEqual(200);
    });
  });

  describe('DELETE categories', () => {
    test('Should delete category', async () => {
      const createdCategory: categories.ICategoryCreate = {
        title: faker.name.title(),
        parentId: testCategory._id.toString()
      };

      const response = await testHelper.api.post('/categories/create').send(createdCategory);

      expect(response.statusCode).toBe(200);

      const category = response.body as WithId<categories.IDBCategory>;
      createdCategories.push(category);

      const deleteRequest = await testHelper.api.delete(`/categories/${category._id.toString()}`);
      expect(deleteRequest.statusCode).toEqual(200);
    });
  })
})