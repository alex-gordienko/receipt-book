interface IReducerFormat<Type extends String, Payload> {
  type: Type;
  payload: Payload;
}

export type IServerErrorAction = IReducerFormat<'SERVER_ERROR', { withRedirect: boolean, errors:string[] }>;
export type IWebErrorAction = IReducerFormat<'WEB_ERROR', { withRedirect: boolean, errors:string[] }>;
export type IClearErrors = IReducerFormat<'CLEAR_ERRORS', undefined>;
export type ISetArticlesPage = IReducerFormat<'SET_ARTICLES_PAGE', number>;
export type ISetReceiptsPage = IReducerFormat<'SET_RECEIPTS_PAGE', number>;
export type ISetAdmin = IReducerFormat<'SET_ADMIN', boolean>;
export type ISaveCategoryListToStorage = IReducerFormat<'SAVE_CATEGORY_LIST', categories.IDBCategory[]>;

type IReducerActions =
  | ISetAdmin
  | IServerErrorAction
  | IWebErrorAction
  | IClearErrors
  | ISetArticlesPage
  | ISetReceiptsPage
  | ISaveCategoryListToStorage;

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

export const setServerError = (dispatch: (value: IReducerActions) => void, payload: { withRedirect: boolean, errors:string[] }) => {
  return dispatch({ type: 'SERVER_ERROR', payload });
}

export const setWebError = (dispatch: (value: IReducerActions) => void, payload: { withRedirect: boolean, errors:string[] }) => {
  return dispatch({ type: 'WEB_ERROR', payload });
}

export const clearErrors = (dispatch: (value: IReducerActions) => void) => {
  return dispatch({ type: 'CLEAR_ERRORS', payload: undefined });
}