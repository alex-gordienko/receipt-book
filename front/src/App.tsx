import Store from './store';
import MainPage from './shared/pages/Main/Main';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
import ReceiptReaderPage from './shared/pages/ReceiptReader/Reader';
import ArticleReaderPage from './shared/pages/ArticleReader/Reader';


const App = () => {

  const routes: RouteObject[] = [
    {
      path: '/',
      element: <MainPage />
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
  
  const router = createBrowserRouter(routes);
  return (
    <Store>
      <RouterProvider router={router} /> 
    </Store>
  );
}

export default App;
