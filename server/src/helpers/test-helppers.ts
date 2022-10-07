import supertest from 'supertest';
import { createApp } from '../app';

export interface ITestHelpers {
  api: supertest.SuperTest<supertest.Test>
}

export const setupAPI = async (): Promise<ITestHelpers> => {
  const app = await createApp();
  return {
    api: supertest(app)
  }
}