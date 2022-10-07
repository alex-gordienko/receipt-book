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
import { MainContainer, MainRightBlock, MainRightBlockTopHeader, MainRightBlockContent, MainRightBlockTitle } from './styled';
import { ArticleContainer, ArticleTitle, ArticleContent, ArticleShortDescription } from "./articles.styled";
import { ReceiptContainer, ReceiptTitle } from "./receipts.styled";
import { AppContext } from '../../../store';
import { saveCategoryList, saveArticlesPage, saveReceiptsPage, setServerError } from "../../../store/actions";
import { useQuery } from "../../helpers/useQuery";
import { useParams, useNavigate } from "react-router-dom";
import BreadCrumps from "../../components/BreadCrumps";
import ReceiptEditor from "../../components/editors/ReceiptEditor";
import ArticleEditor from "../../components/editors/ArticleEditor";
import CategoryEditor from "../../components/editors/CategoryEditor";
import Modal from '../../components/Modal';
import { ButtonContainer, DeleteButton, EditButton } from "../../../styles/globalParams";


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

  useEffect(() => {
    const loadCategoryArticles = async (page: number) => {
      if (categoryId) {
        try {
          const articles = await getArticlesOfCategory(categoryId, page, 20);
          setArticles(articles);
        } catch (error) {
          setServerError(dispatch, { withRedirect: true, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] });
        }
      }
    };
    loadCategoryArticles(articlesPage);
  }, [articlesPage, categoryId, dispatch]);

  useEffect(() => {
    const loadCategoryReceipts = async (page: number) => {
      if (categoryId) {
        try {
          const receipts = await getReceiptsOfCategory(categoryId, page, 20);
          setReceipts(receipts);
        } catch (error) {
          setServerError(dispatch, { withRedirect: true, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] })
        }
      }
    };
    loadCategoryReceipts(receiptsPage);
  }, [receiptsPage, categoryId, dispatch]);

  useEffect(() => {
    const loadCategoryData = async () => {
      if (categoryId) {
        try {
          const selectedCategory = await getCategory(categoryId);
          setSelectedCategory(selectedCategory);
        } catch (error) {
          setServerError(dispatch, { withRedirect: true, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] })
        }
      }
    }
    loadCategoryData();
  }, [state.categoriesList, categoryId, dispatch]);

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

  const renderArticles = (article: articles.IDBArticles): JSX.Element => {
    return (
      <ArticleContainer key={article._id} onClick={() => handleArticleClick(article._id)}>
        <ArticleContent>
          <ArticleTitle>{cropLongText(article.title)}</ArticleTitle>
          <ArticleShortDescription>
            {cropLongText(article.shortDescription)}
          </ArticleShortDescription>
        </ArticleContent>
      </ArticleContainer>
    )
  }

  const renderReceipts = (receipt: receipts.IDBReceipt): JSX.Element => {
    return (
      <ReceiptContainer key={receipt._id} onClick={() => handleReceiptClick(receipt._id)}>
        <ReceiptTitle>{cropLongText(receipt.title)}</ReceiptTitle>
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
            pageSize={20}
            renderAs={renderArticles}
            onCallNextPage={onCallNextPageArticles}
          />
          <ListComponent
            title="Receipts"
            onCallCreateElement={handleCreateElementClick}
            isAdmin={state.isAdmin}
            data={receipts.items}
            totalCount={receipts.totalCount}
            page={receiptsPage}
            pageSize={20}
            renderAs={renderReceipts}
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