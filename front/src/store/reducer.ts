import IAppActions from './actions';
import { Socket } from 'socket.io-client';
export interface IAppState {
  socket: Socket,
  user: user.IUser | null;
  isAdmin: boolean;
  categoriesList: categories.IDBCategory[];
  pageSize: number;
  pageReceipts: number;
  pageArticles: number;
  errors: string[];
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
        errors: action.payload.errors
      };
    case 'WEB_ERROR':
      return {
        ...state,
        errors: action.payload.errors,
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
    case 'SUBSCRIBE_TO_ARTICLES': {
      state.socket.emit('subscribe-to-articles', action.payload);
      return state;
    }
    case 'UNSUBSCRIBE_FROM_ARTICLES': {
      state.socket.emit('unsubscribe-from-articles', action.payload);
      return state;
    }
    case 'SUBSCRIBE_TO_RECEIPTS': {
      state.socket.emit('subscribe-to-receipts', action.payload);
      return state;
    }
    case 'UNSUBSCRIBE_FROM_RECEIPTS': {
      state.socket.emit('unsubscribe-from-receipts', action.payload);
      return state;
    }
    case 'SUBSCRIBE_TO_CATEGORY': {
      state.socket.emit('subscribe-to-category', action.payload);
      return state;
    }
    case 'UNSUBSCRIBE_FROM_CATEGORY': {
      state.socket.emit('unsubscribe-from-category', action.payload);
      return state;
    }
    case 'SAVE_TOKEN': {
      localStorage.setItem('token', action.payload);
      return state;
    }
    case 'SAVE_USER': {
      return {
        ...state,
        user: action.payload
      }
    }
    case 'LOGOUT': {
      localStorage.removeItem('token');
      return {
        ...state,
        user: null
      }
    }
    default:
      return state;
  }
};

export default Reducer;