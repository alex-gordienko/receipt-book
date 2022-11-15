import React, { useContext, useState, useEffect, useCallback } from "react";
import CategoriesTreeBlock from '../../components/CategoriesTree';
import ListComponent from "../../components/ListComponent";
import {
  getCategory,
  createArticle,
  createReceipt,
  deleteCategory,
  editCategory,
  getArticlesOfCategory,
  getReceiptsOfCategory,
  IListResponse,
  isRequestError,
  getCategoriesList
} from '../../helpers/httpConnector';
import { cropLongText } from '../../helpers/textHelpers';
import { MainContainer, MainRightBlock, MainRightBlockTopHeader, MainRightBlockContent, MainRightBlockTitle, LikesCounter } from './styled';
import { ArticleContainer, ArticleTitle, ArticleContent, ArticleShortDescription } from "./articles.styled";
import { ReceiptContainer, ReceiptTitle } from "./receipts.styled";
import { AppContext } from '../../../store';
import {
  subscribeToCategory,
  saveCategoryList,
  saveArticlesPage,
  saveReceiptsPage,
  setServerError,
  subscribeToArticles,
  unsubscribeFromArticles,
  subscribeToReceipts,
  unsubscribeFromReceipts
} from "../../../store/actions";
import { useQuery } from "../../helpers/useQuery";
import { useParams, useNavigate } from "react-router-dom";
import BreadCrumps from "../../components/BreadCrumps";
import ReceiptEditor from "../../components/editors/ReceiptEditor";
import ArticleEditor from "../../components/editors/ArticleEditor";
import CategoryEditor from "../../components/editors/CategoryEditor";
import Modal from '../../components/Modal';
import { ButtonContainer, DeleteButton, EditButton } from "../../../styles/globalParams";
import { useSocketEvents } from "../../../hooks/useSocketEvents";

const MainPage: React.FC<{}> = () => {
  const { state, dispatch } = useContext(AppContext);

  const [openReceiptEditor, setOpenReceiptEditor] = useState(false);
  const [openArticleEditor, setOpenArticleEditor] = useState(false);
  const [openCategoryEditor, setOpenCategoryEditor] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<categories.IDBCategory | null>(null);
  const [articles, setArticles] = useState<IListResponse<articles.IDBArticles>>({totalCount: 0, items: []});
  const [receipts, setReceipts] = useState<IListResponse<receipts.IDBReceipt>>({totalCount: 0, items: []});

  const { categoryId } = useParams();
  const query = useQuery();
  const navigate = useNavigate();
  const articlesPage = Number(query.get('articlesPage') || 1);
  const receiptsPage = Number(query.get('receiptsPage') || 1);

  const loadCategoryData = useCallback(async () => {
    if (categoryId) {
      try {
        subscribeToCategory(dispatch, categoryId);
        const selectedCategory = await getCategory(categoryId);
        setSelectedCategory(selectedCategory);
      } catch (error) {
        setServerError(dispatch, { withRedirect: true, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] })
      }
    }
  }, [categoryId, dispatch]);

  const loadCategoryArticles = useCallback(async (page: number) => {
    if (categoryId) {
      try {
        if (articles.items.length) {
          unsubscribeFromArticles(dispatch, articles.items.map((article) => article._id));
        }
        const responseArticles = await getArticlesOfCategory(categoryId, page, state.pageSize);
        subscribeToArticles(dispatch, responseArticles.items.map((article) => article._id));
        setArticles(responseArticles);
      } catch (error) {
        setServerError(dispatch, { withRedirect: true, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] });
      }
    }
  }, [articles.items.length, categoryId, dispatch, state.pageSize]);

  const loadCategoryReceipts = useCallback(async (page: number) => {
    if (categoryId) {
      try {
        if (receipts.items.length) {
          unsubscribeFromReceipts(dispatch, receipts.items.map((receipt) => receipt._id));
        }
        const responseReceipts = await getReceiptsOfCategory(categoryId, page, state.pageSize);
        subscribeToReceipts(dispatch, responseReceipts.items.map((receipt) => receipt._id));
        setReceipts(responseReceipts);
      } catch (error) {
        setServerError(dispatch, { withRedirect: true, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] })
      }
    }
  }, [categoryId, dispatch, receipts.items.length, state.pageSize]);

  useEffect(() => {
    loadCategoryArticles(articlesPage);
  }, [articlesPage, categoryId, dispatch, loadCategoryArticles]);

  useEffect(() => {
    loadCategoryReceipts(receiptsPage);
  }, [receiptsPage, categoryId, dispatch, loadCategoryReceipts]);

  useEffect(() => {
    loadCategoryData();
  }, [state.categoriesList, categoryId, dispatch, loadCategoryData]);

  const processCategorySocketEvents = useCallback(async (categoryId: string) => {
    console.log(categoryId);
    try {
      await loadCategoryData();
      const result = await getCategoriesList();
      saveCategoryList(dispatch, result);
    } catch (error) {
      setServerError(dispatch, { withRedirect: true, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] })
    }
  }, [dispatch, loadCategoryData]);

  const processArticleSocketEvent = useCallback((articleId: string, action: 'create'|'update'|'delete'|'like') => {
    console.log(articleId);
    const isArticleInLoadedList = articles.items.find(article => article._id === articleId);
    if (
      (action === 'like' && isArticleInLoadedList) ||
      (action === 'update' && isArticleInLoadedList) ||
      (action === 'delete' && isArticleInLoadedList) ||
      (action === 'create' && !isArticleInLoadedList)
    ) {
      try {
        loadCategoryArticles(articlesPage);
      } catch (error) {
        setServerError(dispatch, { withRedirect: true, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] })
      }
    }
  }, [articles.items.length, articlesPage, dispatch, loadCategoryArticles]);

  const processReceiptSocketEvent = useCallback((receiptId: string, action: 'create'|'update'|'delete'|'like') => {
    const isReceiptInLoadedList = receipts.items.find(receipt => receipt._id === receiptId);
    console.log(receiptId);
    if (
      (action === 'like' && isReceiptInLoadedList) ||
      (action === 'update' && isReceiptInLoadedList) ||
      (action === 'delete' && isReceiptInLoadedList) ||
      (action === 'create' && !isReceiptInLoadedList)
    ) {
      try {
        loadCategoryReceipts(articlesPage);
      } catch (error) {
        setServerError(dispatch, { withRedirect: true, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] })
      }
    }
  }, [articlesPage, dispatch, loadCategoryReceipts, receipts.items.length]);

  useSocketEvents(state.socket, 'category', ['update', 'like'], processCategorySocketEvents);
  useSocketEvents(state.socket, 'receipt', ['create', 'delete', 'update', 'like'], processReceiptSocketEvent);
  useSocketEvents(state.socket, 'article', ['create', 'delete', 'update', 'like'], processArticleSocketEvent);

  const handleArticleClick = (articleId: string) => {
    const goToPath = `/categories/${categoryId}/read/article/${articleId}`;
    saveArticlesPage(dispatch, articlesPage);
    saveReceiptsPage(dispatch, receiptsPage);
    navigate(state.isAdmin ? '/admin' + goToPath : goToPath);
  }

  const handleReceiptClick = (receiptId: string) => {
    const goToPath = `/categories/${categoryId}/read/receipt/${receiptId}`;
    saveArticlesPage(dispatch, articlesPage);
    saveReceiptsPage(dispatch, receiptsPage);
    navigate(state.isAdmin ? '/admin' + goToPath : goToPath);
  }

  const RenderArticles: React.FC<articles.IDBArticles> = (props) => {
    return (
      <ArticleContainer key={props._id}>
        <ArticleContent onClick={() => handleArticleClick(props._id)}>
          <ArticleTitle>{cropLongText(props.title)}</ArticleTitle>
          <ArticleShortDescription>
            {cropLongText(props.shortDescription)}
          </ArticleShortDescription>
        </ArticleContent>
        {props.likes ? (<LikesCounter>{props.likes} likes</LikesCounter>) : null}
      </ArticleContainer>
    )
  }

  const RenderReceipts: React.FC<receipts.IDBReceipt> = (props) => {
    return (
      <ReceiptContainer key={props._id} onClick={() => handleReceiptClick(props._id)}>
        <ReceiptTitle>{cropLongText(props.title)}</ReceiptTitle>
        {props.likes ? (<LikesCounter>{props.likes} likes</LikesCounter>) : null}
      </ReceiptContainer>
    )
  }

  const handleCreateElementClick = (title: string) => {
    if (title === 'Articles') {
      setOpenArticleEditor(true);
    }
    if (title === 'Receipts') {
      setOpenReceiptEditor(true);
    }
  }

  const onCreateArticle = async (newArticle: articles.IArticleCreate) => {
    try {
      const createdArticle = await createArticle(newArticle);
      handleArticleClick(createdArticle._id);
    } catch (error) {
      setServerError(dispatch, { withRedirect: false, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] });
    }
  }

  const onCreateReceipt = async (newReceipt: receipts.IReceiptCreate) => {
    try {
      const createdReceipt = await createReceipt(newReceipt);
      handleReceiptClick(createdReceipt._id);
    } catch (error) {
      setServerError(dispatch, { withRedirect: false, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] });
    }
  }

  const onCallNextPageArticles = (newPage: number) => {
    const goToPath = `/categories/${categoryId}?articlesPage=${newPage}&receiptsPage=${receiptsPage}`;
    navigate(state.isAdmin ? '/admin' + goToPath : goToPath);
  }

  const onCallNextPageReceipts = (newPage: number) => {
    const goToPath = `/categories/${categoryId}?articlesPage=${articlesPage}&receiptsPage=${newPage}`;
    navigate(state.isAdmin ? '/admin' + goToPath : goToPath);
  }

  if (!selectedCategory) {
    return (
      <MainContainer>
        <CategoriesTreeBlock />
        <MainRightBlockContent>
          <MainRightBlockTitle>Please, select category to continue</MainRightBlockTitle>
        </MainRightBlockContent>
      </MainContainer>
    )
  }

  const onEditCategory = async (newCategory: categories.ICategoryCreate) => {
    try {
      await editCategory(selectedCategory._id, newCategory);
      const filteredCategories = state.categoriesList.filter((category: categories.IDBCategory) => category._id !== selectedCategory._id);
      saveCategoryList(dispatch, [...filteredCategories, { ...selectedCategory, ...newCategory }]);
      setOpenCategoryEditor(false);
    } catch (error) {
      setServerError(dispatch, { withRedirect: false, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] });
    }
  }

  const processDeleteCategory = async () => {
    try {
      await deleteCategory(selectedCategory._id);
      const result = await getCategoriesList();
      saveCategoryList(dispatch, result);
      navigate(state.isAdmin ? '/admin' : '');
      setSelectedCategory(null);
      setOpenDeleteDialog(false);
    } catch (error) {
      setServerError(dispatch, { withRedirect: true, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] });
    }
  }

  return (
    <MainContainer>
      <CategoriesTreeBlock />
      <MainRightBlock>
        <MainRightBlockTopHeader>
          <MainRightBlockTitle>Content of "{selectedCategory.title}"</MainRightBlockTitle>
          <ButtonContainer>
            {state.isAdmin ? (
              <>
                <EditButton onClick={() => setOpenCategoryEditor(true)}>Edit Category</EditButton>
                <DeleteButton onClick={() => setOpenDeleteDialog(true)}>Delete Category</DeleteButton>
              </>
            ) : null}
          </ButtonContainer>
        </MainRightBlockTopHeader>
        <BreadCrumps categoryId={selectedCategory._id} />
        <MainRightBlockContent>
          <ListComponent
            title="Articles"
            onCallCreateElement={handleCreateElementClick}
            isAdmin={state.isAdmin}
            data={articles.items}
            totalCount={articles.totalCount}
            page={articlesPage}
            pageSize={state.pageSize}
            renderAs={RenderArticles}
            onCallNextPage={onCallNextPageArticles}
          />
          <ListComponent
            title="Receipts"
            onCallCreateElement={handleCreateElementClick}
            isAdmin={state.isAdmin}
            data={receipts.items}
            totalCount={receipts.totalCount}
            page={receiptsPage}
            pageSize={state.pageSize}
            renderAs={RenderReceipts}
            onCallNextPage={onCallNextPageReceipts}
          />
        </MainRightBlockContent>
      </MainRightBlock>
      <Modal
        show={openDeleteDialog}
        type="warning"
        name={`Are you sure want to delete '${selectedCategory.title}'?`}
        onOK={processDeleteCategory}
        onCancel={() => setOpenDeleteDialog(false)}
      >
        <>
          <p>All articles and receipts of this category will be deleted.</p>
          <p>Child categories will be assign to {state.categoriesList.find((c) => c._id === selectedCategory.parentId)?.title || 'parent category'}</p>
          <p>This Step can't cancel</p>
        </>
      </Modal>
      <CategoryEditor open={openCategoryEditor} initialData={selectedCategory} onCancel={() => setOpenCategoryEditor(false)} onCreate={onEditCategory} />
      <ReceiptEditor open={openReceiptEditor} selectedCategoryId={selectedCategory._id} onCancel={() => setOpenReceiptEditor(false)} onCreate={onCreateReceipt} />
      <ArticleEditor open={openArticleEditor} selectedCategoryId={selectedCategory._id} onCancel={() => setOpenArticleEditor(false)} onCreate={onCreateArticle} />
    </MainContainer>
  )
}

export default MainPage