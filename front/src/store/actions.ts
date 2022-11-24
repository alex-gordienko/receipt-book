interface IReducerFormat<Type extends String, Payload> {
  type: Type;
  payload: Payload;
}

export type IServerErrorAction = IReducerFormat<'SERVER_ERROR', { errors:string[] }>;
export type IWebErrorAction = IReducerFormat<'WEB_ERROR', { errors:string[] }>;
export type IClearErrors = IReducerFormat<'CLEAR_ERRORS', undefined>;
export type ISetArticlesPage = IReducerFormat<'SET_ARTICLES_PAGE', number>;
export type ISetReceiptsPage = IReducerFormat<'SET_RECEIPTS_PAGE', number>;
export type ISetAdmin = IReducerFormat<'SET_ADMIN', boolean>;
export type ISaveCategoryListToStorage = IReducerFormat<'SAVE_CATEGORY_LIST', categories.IDBCategory[]>;

export type ISubscribeToCategory = IReducerFormat<'SUBSCRIBE_TO_CATEGORY', string>;
export type IUnsubscribeFromCategory = IReducerFormat<'UNSUBSCRIBE_FROM_CATEGORY', string>;
export type ISubscribeToArticles = IReducerFormat<'SUBSCRIBE_TO_ARTICLES', string[]>;
export type IUnsubscribeFromArticles = IReducerFormat<'UNSUBSCRIBE_FROM_ARTICLES', string[]>;
export type ISubscribeToReceipts = IReducerFormat<'SUBSCRIBE_TO_RECEIPTS', string[]>;
export type IUnsubscribeFromReceipts = IReducerFormat<'UNSUBSCRIBE_FROM_RECEIPTS', string[]>;

export type ISaveToken = IReducerFormat<'SAVE_TOKEN', string>;
export type ISaveUser = IReducerFormat<'SAVE_USER', user.IUser>;
export type ILogoutUser = IReducerFormat<'LOGOUT', undefined>;

type IReducerActions =
  | ISetAdmin
  | IServerErrorAction
  | IWebErrorAction
  | IClearErrors
  | ISetArticlesPage
  | ISetReceiptsPage
  | ISubscribeToCategory
  | IUnsubscribeFromCategory
  | ISubscribeToArticles
  | IUnsubscribeFromArticles
  | ISubscribeToReceipts
  | IUnsubscribeFromReceipts
  | ISaveCategoryListToStorage
  | ISaveToken
  | ISaveUser
  | ILogoutUser;

export default IReducerActions;

export const setAdmin = (dispatch: (value: IReducerActions) => void, payload: boolean) => {
  return dispatch({ type: 'SET_ADMIN', payload });
}

export const saveCategoryList = (dispatch: (value: IReducerActions) => void, payload: categories.IDBCategory[]) => {
  return dispatch({ type: 'SAVE_CATEGORY_LIST', payload });
}

export const saveArticlesPage = (dispatch: (value: IReducerActions) => void, payload: number) => {
  return dispatch({ type: 'SET_ARTICLES_PAGE', payload });
}

export const saveReceiptsPage = (dispatch: (value: IReducerActions) => void, payload: number) => {
  return dispatch({ type: 'SET_RECEIPTS_PAGE', payload });
}

export const setServerError = (dispatch: (value: IReducerActions) => void, payload: { errors:string[] }) => {
  return dispatch({ type: 'SERVER_ERROR', payload });
}

export const setWebError = (dispatch: (value: IReducerActions) => void, payload: { errors:string[] }) => {
  return dispatch({ type: 'WEB_ERROR', payload });
}

export const clearErrors = (dispatch: (value: IReducerActions) => void) => {
  return dispatch({ type: 'CLEAR_ERRORS', payload: undefined });
}

export const subscribeToCategory = (dispatch: (value: IReducerActions) => void, categoryId: string) => {
  return dispatch({ type: 'SUBSCRIBE_TO_CATEGORY', payload: categoryId });
}

export const unsubscribeFromCategory = (dispatch: (value: IReducerActions) => void, categoryId: string) => {
  return dispatch({ type: 'UNSUBSCRIBE_FROM_CATEGORY', payload: categoryId });
}

export const subscribeToArticles = (dispatch: (value: IReducerActions) => void, articleIds: string[]) => {
  return dispatch({ type: 'SUBSCRIBE_TO_ARTICLES', payload: articleIds });
}

export const unsubscribeFromArticles = (dispatch: (value: IReducerActions) => void, articleIds: string[]) => {
  return dispatch({ type: 'UNSUBSCRIBE_FROM_ARTICLES', payload: articleIds });
}

export const subscribeToReceipts = (dispatch: (value: IReducerActions) => void, receiptIds: string[]) => {
  return dispatch({ type: 'SUBSCRIBE_TO_RECEIPTS', payload: receiptIds });
}

export const unsubscribeFromReceipts = (dispatch: (value: IReducerActions) => void, receiptIds: string[]) => {
  return dispatch({ type: 'UNSUBSCRIBE_FROM_RECEIPTS', payload: receiptIds });
}

export const saveToken = (dispatch: (value: IReducerActions) => void, token: string) => {
  return dispatch({ type: 'SAVE_TOKEN', payload: token });
}

export const saveUser = (dispatch: (value: IReducerActions) => void, user: user.IUser) => {
  return dispatch({ type: 'SAVE_USER', payload: user });
}

export const logoutUser = (dispatch: (value: IReducerActions) => void) => {
  return dispatch({ type: 'LOGOUT', payload: undefined });
}