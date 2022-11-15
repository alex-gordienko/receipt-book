import Store from './store';
import MainPage from './shared/pages/Main/Main';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
import ReceiptReaderPage from './shared/pages/ReceiptReader/Reader';
import ArticleReaderPage from './shared/pages/ArticleReader/Reader';
import Authorization from './shared/pages/Authorization';
import Header from './shared/components/Header';


const App = () => {

  const routes: RouteObject[] = [
    {
      path: '/',
      element: <MainPage />
    },
    {
      path: '/login',
      element: <Authorization mode={"Authorization"}/>
    },
    {
      path: '/admin/login',
      element: <Authorization mode={"Authorization"}/>
    },
    {
      path: '/signup',
      element: <Authorization mode={"Registration"}/>
    },
    {
      path: '/admin/signup',
      element: <Authorization mode={"Registration"}/>
    },
    {
      path: '/categories/:categoryId',
      element: <MainPage />
    },
    {
      path: '/admin',
      element: <MainPage />
    },
    {
      path: '/admin/categories/:categoryId',
      element: <MainPage />
    },
    {
      path: '/categories/:categoryId/read/receipt/:id',
      element: <ReceiptReaderPage />
    },
    {
      path: '/categories/:categoryId/read/article/:id',
      element: <ArticleReaderPage />
    },
    {
      path: '/admin/categories/:categoryId/read/receipt/:id',
      element: <ReceiptReaderPage />
    },
    {
      path: '/admin/categories/:categoryId/read/article/:id',
      element: <ArticleReaderPage />
    },
  ];

  const routesWithHeader = routes.map((routeObj: RouteObject) => ({
    path: routeObj.path,
    element: (
      <>
        <Header />
        {routeObj.element}
      </>
    )
  }))
  
  const router = createBrowserRouter(routesWithHeader);
  return (
    <Store>
      <RouterProvider router={router} />
    </Store>
  );
}

export default App;
