import IAppActions from './actions';
export interface IAppState {
  isAdmin: boolean;
  categoriesList: categories.IDBCategory[];
  pageReceipts: number;
  pageArticles: number;
  errors: string[];
  redirectToMain: boolean;
}

const Reducer = (state: IAppState, action: IAppActions): IAppState => {
  switch (action.type) {
    case 'SET_ADMIN':
      return {
        ...state,
        isAdmin: action.payload,
      };
    case 'SAVE_CATEGORY_LIST':
      return {
        ...state,
        categoriesList: action.payload
      };
    case 'SERVER_ERROR':
      return {
        ...state,
        errors: action.payload.errors,
        redirectToMain: action.payload.withRedirect
      };
    case 'WEB_ERROR':
      return {
        ...state,
        errors: action.payload.errors,
        redirectToMain: action.payload.withRedirect
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: [],
      }
    case 'SET_ARTICLES_PAGE':
      return {
        ...state,
        pageArticles: action.payload
      };
    case 'SET_RECEIPTS_PAGE':
      return {
        ...state,
        pageReceipts: action.payload
      };
    default:
      return state;
  }
};

export default Reducer;