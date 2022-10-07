
import React, { createContext, useEffect, useReducer, useMemo } from "react";
import Modal from "../shared/components/Modal";
import { getCategoriesList } from "../shared/helpers/httpConnector";
import IAppActions, { saveCategoryList, setServerError, setAdmin, clearErrors } from './actions';
import Reducer, { IAppState } from './reducer';


const initialState: IAppState = {
  isAdmin: false,
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
  }, [routePath])

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