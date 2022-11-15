
import React, { createContext, useEffect, useReducer, useMemo } from "react";
import Modal from "../shared/components/Modal";
import { getCategoriesList, getUser, isRequestError } from "../shared/helpers/httpConnector";
import IAppActions, { saveCategoryList, setServerError, setAdmin, clearErrors, saveUser } from './actions';
import Reducer, { IAppState } from './reducer';
import { io } from 'socket.io-client';
import { serverAddress } from '../shared/helpers/httpConnector';

const initialState: IAppState = {
  socket: io(serverAddress),
  user: null,
  isAdmin: false,
  pageSize: 20,
  categoriesList: [],
  pageReceipts: 1,
  pageArticles: 1,
  errors: [],
  redirectToMain: true
};

export const AppContext = createContext<{
  state: IAppState;
  dispatch: React.Dispatch<IAppActions>;
}>({
  state: initialState,
  dispatch: () => null
});

const Store: React.FC<{children: JSX.Element}> = ({children}) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const routePath = useMemo(() => window.location.pathname.split('/'), []);

  useEffect(() => {
    setAdmin(dispatch, routePath.includes('admin'));
  }, [routePath]);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      console.log(routePath, state.user);
      try {
        if (!state.user && !token && !routePath.includes('login')) {
          console.log('!state.user || !token');
          window.location.replace(state.isAdmin ? '/admin/login' : '/login');
        }
        if (state.user && routePath.includes('login')) {
          console.log('state.user && routePath.includes(login)');
          window.location.replace(state.isAdmin ? '/admin' : '/')
        }
        if (!state.user && !routePath.includes('login')) {
          console.log('!state.user');
          const user = await getUser();
          saveUser(dispatch, user);
        }
      } catch (error) {
        if (!token && !state.user) {
          console.log('!token || !state.user');
          window.location.replace(state.isAdmin ? '/admin/login' : '/login');
        }
        setServerError(dispatch, { withRedirect: false, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] })
      }
    }
    loadUser();
  }, [routePath, state.isAdmin, state.user])

  useEffect(() => {
    const getTree = async () => {
      if (!state.categoriesList.length) {
        try {
          const result = await getCategoriesList();
          saveCategoryList(dispatch, result);
        } catch (err) {
          setServerError(dispatch, {withRedirect: true, errors: [JSON.stringify(err)]})
        }
      }
    };
    getTree();
  }, [dispatch, state.categoriesList.length]);

  const renderErrorModal = () => {
    const handleAcceptClick = () => {
      clearErrors(dispatch);
      if (!state.user) {
        window.location.replace('/login');
      }
      if (state.redirectToMain) {
        window.location.replace(state.isAdmin ? '/admin' : '/')
      }
    }

    return (
      <Modal show={true} type="warning" name="Ooopsie. Something going not good" onOK={handleAcceptClick}>
        <>{state.errors.map((error: string) => (<p>{error}</p>))}</>
      </Modal>
    )
  }
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {state.errors.length ? renderErrorModal() : children}
    </AppContext.Provider>
  )
};

export default Store;