import axios, { AxiosError } from 'axios';

const serverAddress = 'http://localhost:5001';

export interface IListResponse<T> { totalCount: number; items: T[] }

const get = async <TResponse>(path: string): Promise<TResponse> => {
  try {
    const response = await axios.get(serverAddress + path);
    return response.data
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      throw new RequestError(err.response.statusText, err.response.status, JSON.stringify(err.response.data))
    }
    throw err
  }
}
const post = async <TData, TResponse>(path: string, data: TData): Promise<TResponse> => {
  try {
    const response = await axios.post(serverAddress + path, data);
    return response.data
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      throw new RequestError(err.response.statusText, err.response.status, JSON.stringify(err.response.data))
    }
    throw err
  }
}

const put = async <TData, TResponse>(path: string, data: TData): Promise<TResponse> => {
  try {
    const response = await axios.put(serverAddress + path, data);
    return response.data
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      throw new RequestError(err.response.statusText, err.response.status, JSON.stringify(err.response.data))
    }
    throw err
  }
}

const del = async <TResponse, >(path: string): Promise<TResponse> => {
  try {
    const response = await axios.delete(serverAddress + path);
    return response.data
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      throw new RequestError(err.response.statusText, err.response.status, JSON.stringify(err.response.data))
    }
    throw err
  }
}

export const getReceipt = async (receiptId: string) =>
  get<receipts.IDBReceipt>(`/receipts/${receiptId}`);

export const getArticle = async (articleId: string) =>
  get<articles.IDBArticles>(`/articles/${articleId}`);

export const getCategory = async (categoryId: string) => 
  get<categories.IDBCategory>(`/categories/${categoryId}`);

export const getCategoriesList = async () => 
  get<categories.ICategoryTree[]>('/categories/list');

export const getArticlesOfCategory = async (categoryId: string, page: number, pageSize: number) => 
  get<IListResponse<articles.IDBArticles>>(`/articles/list-by-category/${categoryId}?page=${page}&pageSize=${pageSize}`);

export const getReceiptsOfCategory = async (categoryId: string, page: number, pageSize: number) => 
  get<IListResponse<receipts.IDBReceipt>>(`/receipts/list-by-category/${categoryId}?page=${page}&pageSize=${pageSize}`);

export const createCategory = async (dataToCreate: categories.ICategoryCreate) =>
  post<categories.ICategoryCreate, categories.IDBCategory>(`/categories/create`, dataToCreate);

export const createArticle = async (dataToCreate: articles.IArticleCreate) =>
  post<articles.IArticleCreate, articles.IDBArticles>(`/articles/create`, dataToCreate);

export const createReceipt = async (dataToCreate: receipts.IReceiptCreate) =>
  post<receipts.IReceiptCreate, receipts.IDBReceipt>(`/receipts/create`, dataToCreate);

export const editArticle = async (articleId: string, dataToUpdate: articles.IArticleEdit) =>
  put<articles.IArticleEdit, void>(`/articles/edit/${articleId}`, dataToUpdate);

export const editReceipt = async (receiptId: string, dataToUpdate: receipts.IReceiptEdit) =>
  put<receipts.IReceiptEdit, void>(`/receipts/edit/${receiptId}`, dataToUpdate);

export const editCategory = async (categoryId: string, dataToUpdate: categories.ICategoryEdit) =>
  put<categories.ICategoryEdit, void>(`/categories/edit/${categoryId}`, dataToUpdate);

export const deleteArticle = async (articleId: string) =>
  del(`/articles/${articleId}`);

export const deleteReceipt = async (receiptId: string) =>
  del(`/receipts/${receiptId}`);

export const deleteCategory = async (categoryId: string) =>
  del(`/categories/${categoryId}`);

export class RequestError extends Error {
  public statusCode: number;
  public message: string;
  constructor(name: string, status: number, message: string) {
    super(name);
    this.statusCode = status;
    this.message = message;
  }
}

export const isRequestError = (error: unknown): error is RequestError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'statusCode' in error &&
    (typeof (error as Record<string, unknown>).message === 'string' || typeof (error as Record<string, unknown>).message === 'object') &&
    typeof (error as Record<string, unknown>).statusCode === 'number'
  )
}