import { setupAPI, ITestHelpers } from '../../helpers/test-helppers';
import * as faker from 'faker';
import { WithId } from 'mongodb';

let testHelper: ITestHelpers;

describe('API /receipts', () => {
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
  describe('GET receipts', () => {
    test('Should get an error if no ID in URL', async () => {
      const response = await testHelper.api.get('/receipts/');
  
      expect(response.statusCode).toBe(404);
    });
  
    test('Should get an error if receipt does not exists', async () => {
      const response = await testHelper.api.get('/receipts/54edb381a13ec9142b9bb353');

      expect(response.statusCode).toBe(404);
      expect(response.text).toEqual(`Can't find receipt by ID = 54edb381a13ec9142b9bb353`);
    });
  });

  describe('POST receipts', () => {
    test('Should get an error if some field does not provided', async () => {
      const newReceipt = {
        title: 'Test Failed receipt 1',
        description: 'qwerty',

      };

      const response = await testHelper.api.post('/receipts/create').send(newReceipt);

      expect(response.statusCode).toEqual(400);
      expect(response.body[0].key).toEqual('categoryId');
    });

    test('Should get an error if try to assign receipt for invalid category', async () => {
      const testReceipt1: receipts.IReceiptCreate = {
        title: 'Test Failed receipt 2',
        description: 'qwerrty',
        categoryId: 'qascfdcf'
      };

      const incorrectRequest1 = await testHelper.api.post('/receipts/create').send(testReceipt1);
      expect(incorrectRequest1.statusCode).toEqual(400);
      expect(incorrectRequest1.text).toEqual('Category Id is incorrect');

      const testReceipt2: receipts.IReceiptCreate = {
        title: 'Test Failed receipt 2',
        description: 'qwerrty',
        categoryId: '6324267ba72ff4680fedae27'
      };

      const incorrectRequest2 = await testHelper.api.post('/receipts/create').send(testReceipt2);
      expect(incorrectRequest2.statusCode).toEqual(400);
      expect(incorrectRequest2.text).toEqual(`Category with ID = ${testReceipt2.categoryId} is not exist`);
    });
    test('Should success create receipt', async () => {
      const testReceipt: receipts.IReceiptCreate = {
        title: faker.name.title(),
        description: faker.lorem.paragraph(),
        categoryId: testCategory._id.toString()
      };

      const correctRequest = await testHelper.api.post('/receipts/create').send(testReceipt);
      expect(correctRequest.statusCode).toEqual(200);
    });
  });

  describe('PUT receipts', () => {
    test('Should get an error if ID not provided', async () => {
      const testReceipt: receipts.IReceiptCreate = {
        title: faker.name.title(),
        description: faker.lorem.paragraph(),
        categoryId: testCategory._id.toString()
      };

      const correctRequest = await testHelper.api.post('/receipts/create').send(testReceipt);
      expect(correctRequest.statusCode).toEqual(200);
    
      const editReceiptResponse = await testHelper.api.put(`/receipts/edit/qwert`).send({ title: 'Errrrrror' });
      expect(editReceiptResponse.statusCode).toEqual(400);
      expect(editReceiptResponse.text).toEqual('Receipt Id should be provided');
    });
    test('Should get an error if some field is invalid', async () => {
      const testReceipt: receipts.IReceiptCreate = {
        title: faker.name.title(),
        description: faker.lorem.paragraph(),
        categoryId: testCategory._id.toString()
      };

      const correctRequest = await testHelper.api.post('/receipts/create').send(testReceipt);
      const createdReceipt = correctRequest.body as WithId<receipts.IDBReceipt>;
      expect(correctRequest.statusCode).toEqual(200);
    
      const editReceiptResponse = await testHelper.api.put(`/receipts/edit/${createdReceipt._id.toString()}`).send({ title: 123123 });
      expect(editReceiptResponse.statusCode).toEqual(400);
      expect(editReceiptResponse.body[0].key).toEqual('title');
    });

    test('Should get an error if receipt is not exists', async () => {
      const invalidReceiptId = '54edb381a13ec9142b9bb353';
      const editReceiptResponse = await testHelper.api.put(`/receipts/edit/${invalidReceiptId}`).send({ title: 'qwerty' });
      expect(editReceiptResponse.statusCode).toEqual(404);
      expect(editReceiptResponse.text).toEqual(`Can't find receipt by ID = ${invalidReceiptId}`)
    });

    test('Should get an error if try to assign receipt for invalid category', async () => {
      const testReceipt: receipts.IReceiptCreate = {
        title: faker.name.title(),
        description: faker.lorem.paragraph(),
        categoryId: testCategory._id.toString()
      };

      const correctRequest = await testHelper.api.post('/receipts/create').send(testReceipt);
      const createdReceipt = correctRequest.body as WithId<receipts.IDBReceipt>;
      expect(correctRequest.statusCode).toEqual(200);
    
      const editReceiptResponse1 = await testHelper.api.put(`/receipts/edit/${createdReceipt._id.toString()}`).send({ categoryId: '123123' });
      expect(editReceiptResponse1.statusCode).toEqual(400);
      expect(editReceiptResponse1.text).toEqual('Category Id is incorrect');

      const editReceiptResponse2 = await testHelper.api.put(`/receipts/edit/${createdReceipt._id.toString()}`).send({ categoryId: '6324267ea42af4640fedde97' });
      expect(editReceiptResponse2.statusCode).toEqual(400);
      expect(editReceiptResponse2.text).toEqual(`Category with ID = 6324267ea42af4640fedde97 is not exist`);
    });

    test('Should success edit receipt', async () => {
      const testReceipt: receipts.IReceiptCreate = {
        title: faker.name.title(),
        description: faker.lorem.paragraph(),
        categoryId: testCategory._id.toString()
      };

      const correctRequest = await testHelper.api.post('/receipts/create').send(testReceipt);
      expect(correctRequest.statusCode).toEqual(200);
    
      const receipt = correctRequest.body as WithId<receipts.IDBReceipt>;
      const editReceiptResponse1 = await testHelper.api.put(`/receipts/edit/${receipt._id.toString()}`).send({ title: 'Edited receipt', description: 'Edited description' });
      expect(editReceiptResponse1.statusCode).toEqual(200);
    });
  });

  describe('DELETE receipts', () => {
    test('Should delete receipt', async () => {
      const testReceipt: receipts.IReceiptCreate = {
        title: faker.name.title(),
        description: faker.lorem.paragraph(),
        categoryId: testCategory._id.toString()
      };

      const correctRequest = await testHelper.api.post('/receipts/create').send(testReceipt);
      expect(correctRequest.statusCode).toEqual(200);
    
      const receipt = correctRequest.body as WithId<receipts.IDBReceipt>;

      const deleteRequest = await testHelper.api.delete(`/receipts/${receipt._id.toString()}`);
      expect(deleteRequest.statusCode).toEqual(200);
    });
  })
})