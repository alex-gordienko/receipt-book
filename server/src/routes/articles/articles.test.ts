import { setupAPI, ITestHelpers } from '../../helpers/test-helppers';
import * as faker from 'faker';
import { WithId } from 'mongodb';

let testHelper: ITestHelpers;

describe('API /articles', () => {
  const testCategoryCreate: categories.ICategoryCreate = {
    title: faker.name.title(),
    parentId: null,
  }
  let testCategory: WithId<categories.IDBCategory>;
  beforeAll(async () => {
    testHelper = await setupAPI();
    const createCategoryResponse = await testHelper.api.post('/categories/create').send(testCategoryCreate);
    testCategory = createCategoryResponse.body as WithId<categories.IDBCategory>;
  });
  afterAll(async () => {
    await testHelper.api.delete(`/categories/${testCategory._id.toString()}`).send();
  })
  describe('GET articles', () => {
    test('Should get an error if no ID in URL', async () => {
      const response = await testHelper.api.get('/articles/');
  
      expect(response.statusCode).toBe(404);
    });
  
    test('Should get an error if article does not exists', async () => {
      const response = await testHelper.api.get('/articles/54edb381a13ec9142b9bb353');

      expect(response.statusCode).toBe(404);
      expect(response.text).toEqual(`Can't find article by ID = 54edb381a13ec9142b9bb353`);
    });
  });

  describe('POST articles', () => {
    test('Should get an error if some field does not provided', async () => {
      const newArticle = {
        title: faker.name.title(),
        description: faker.lorem.paragraph(),
      };

      const response = await testHelper.api.post('/articles/create').send(newArticle);

      expect(response.statusCode).toEqual(400);
      expect(response.body[0].key).toEqual('shortDescription');
    });

    test('Should get an error if try to assign article for invalid category', async () => {
      const testReceipt1: articles.IArticleCreate = {
        title: faker.name.title(),
        shortDescription: faker.lorem.sentence(),
        longDescription: faker.lorem.paragraph(),
        categoryId: 'qascfdcf'
      };

      const incorrectRequest1 = await testHelper.api.post('/articles/create').send(testReceipt1);
      expect(incorrectRequest1.statusCode).toEqual(400);
      expect(incorrectRequest1.text).toEqual('Category Id is incorrect');

      const testReceipt2: articles.IArticleCreate = {
        title: faker.name.title(),
        shortDescription: faker.lorem.sentence(),
        longDescription: faker.lorem.paragraph(),
        categoryId: '6324267ba72ff4680fedae27'
      };

      const incorrectRequest2 = await testHelper.api.post('/articles/create').send(testReceipt2);
      expect(incorrectRequest2.statusCode).toEqual(404);
      expect(incorrectRequest2.text).toEqual(`Can't find category by ID = ${testReceipt2.categoryId}`);
    });
    test('Should success create article', async () => {
      const testArticle: articles.IArticleCreate = {
        title: faker.name.title(),
        shortDescription: faker.lorem.sentence(),
        longDescription: faker.lorem.paragraph(),
        categoryId: testCategory._id.toString()
      };

      const correctRequest = await testHelper.api.post('/articles/create').send(testArticle);
      expect(correctRequest.statusCode).toEqual(200);
    });
  });

  describe('PUT articles', () => {
    test('Should get an error if ID not provided', async () => {
      const testArticle: articles.IArticleCreate = {
        title: faker.name.title(),
        shortDescription: faker.lorem.sentence(),
        longDescription: faker.lorem.paragraph(),
        categoryId: testCategory._id.toString()
      };

      const correctRequest = await testHelper.api.post('/articles/create').send(testArticle);
      expect(correctRequest.statusCode).toEqual(200);
    
      const editArticleResponse = await testHelper.api.put(`/articles/edit/qwert`).send({ title: 'Errrrrror' });
      expect(editArticleResponse.statusCode).toEqual(400);
      expect(editArticleResponse.text).toEqual('Receipt Id should be provided');
    });
    test('Should get an error if some field is invalid', async () => {
      const testArticle: articles.IArticleCreate = {
        title: faker.name.title(),
        shortDescription: faker.lorem.sentence(),
        longDescription: faker.lorem.paragraph(),
        categoryId: testCategory._id.toString()
      };

      const correctRequest = await testHelper.api.post('/articles/create').send(testArticle);
      const createdReceipt = correctRequest.body as WithId<articles.IDBArticles>;
      expect(correctRequest.statusCode).toEqual(200);
    
      const editArticleResponse = await testHelper.api.put(`/articles/edit/${createdReceipt._id.toString()}`).send({ title: 123123 });
      expect(editArticleResponse.statusCode).toEqual(400);
      expect(editArticleResponse.body[0].key).toEqual('title');
    });

    test('Should get an error if article is not exists', async () => {
      const invalidArticleId = '54edb381a13ec9142b9bb353';
      const editArticleResponse = await testHelper.api.put(`/articles/edit/${invalidArticleId}`).send({ title: 'qwerty' });
      expect(editArticleResponse.statusCode).toEqual(404);
      expect(editArticleResponse.text).toEqual(`Can't find article by ID = ${invalidArticleId}`)
    });

    test('Should get an error if try to assign article for invalid category', async () => {
      const testArticle: articles.IArticleCreate = {
        title: faker.name.title(),
        shortDescription: faker.lorem.sentence(),
        longDescription: faker.lorem.paragraph(),
        categoryId: testCategory._id.toString()
      };

      const correctRequest = await testHelper.api.post('/articles/create').send(testArticle);
      const createdReceipt = correctRequest.body as WithId<articles.IDBArticles>;
      expect(correctRequest.statusCode).toEqual(200);
    
      const editReceiptResponse1 = await testHelper.api.put(`/articles/edit/${createdReceipt._id.toString()}`).send({ categoryId: '123123' });
      expect(editReceiptResponse1.statusCode).toEqual(400);
      expect(editReceiptResponse1.text).toEqual('Category Id is incorrect');

      const wrongCategory = '6324267ea42af4640fedde97';

      const editReceiptResponse2 = await testHelper.api.put(`/articles/edit/${createdReceipt._id.toString()}`).send({ categoryId: wrongCategory });
      expect(editReceiptResponse2.statusCode).toEqual(404);
      expect(editReceiptResponse2.text).toEqual(`Can't find category by ID = ${wrongCategory}`);
    });

    test('Should success edit article', async () => {
      const testArticle: articles.IArticleCreate = {
        title: faker.name.title(),
        shortDescription: faker.lorem.sentence(),
        longDescription: faker.lorem.paragraph(),
        categoryId: testCategory._id.toString()
      };

      const correctRequest = await testHelper.api.post('/articles/create').send(testArticle);
      expect(correctRequest.statusCode).toEqual(200);
    
      const article = correctRequest.body as WithId<articles.IDBArticles>;
      const editReceiptResponse1 = await testHelper.api.put(`/articles/edit/${article._id.toString()}`).send({ title: 'Edited article', shortDescription: 'Edited description' });
      expect(editReceiptResponse1.statusCode).toEqual(200);
    });
  });

  describe('DELETE articles', () => {
    test('Should delete article', async () => {
      const testArticle: articles.IArticleCreate = {
        title: faker.name.title(),
        shortDescription: faker.lorem.sentence(),
        longDescription: faker.lorem.paragraph(),
        categoryId: testCategory._id.toString()
      };

      const correctRequest = await testHelper.api.post('/articles/create').send(testArticle);
      expect(correctRequest.statusCode).toEqual(200);
    
      const article = correctRequest.body as WithId<articles.IDBArticles>;

      const deleteRequest = await testHelper.api.delete(`/articles/${article._id.toString()}`);
      expect(deleteRequest.statusCode).toEqual(200);
    });
  })
})