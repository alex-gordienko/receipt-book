import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from '../../../store';
import { setServerError, setWebError } from "../../../store/actions";
import BreadCrumps from "../../components/BreadCrumps";
import { deleteArticle, editArticle, getArticle, isRequestError } from "../../helpers/httpConnector";
import { ButtonBase, EditButton, DeleteButton, ButtonContainer } from "../../../styles/globalParams";
import {
  ReaderContainer,
  ReaderContentBlock,
  ReaderContentBlockTopContainer,
  ReaderContentBlockTitle,
  ReaderContentBlockContent,
  ReaderContentBlockTextBlock,
  ReaderContentBlockContentText,
  ReaderContentBlockContentImage
} from "./styled";
import ArticleEditor from "../../components/editors/ArticleEditor";
import Modal from "../../components/Modal";


const ReaderPage: React.FC<{}> = (props) => {
  const { state, dispatch } = useContext(AppContext);
  const { categoryId, id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<articles.IDBArticles>();
  const [openEditor, setOpenEditor] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const routePath = window.location.pathname.split('/');
  const isArticle = routePath.includes('article');

  useEffect(() => {
    const loadData = async () => {
      if (isArticle && id && !article) {
        try {
          setArticle(await getArticle(id));
        } catch (error) {
          setServerError(dispatch, { withRedirect: true, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] });
        }
      }
    }
    loadData();
  }, [article, dispatch, id, isArticle]);

  const handleClickBack = () => {
    const pathTo = `/categories/${categoryId}?articlesPage=${state.pageArticles}&receiptsPage=${state.pageReceipts}`;
    navigate(state.isAdmin ? '/admin' + pathTo : pathTo);
  }

  const handleClickEdit = () => {
    setOpenEditor(true);
  }

  const handleOnSaveChanges = async (updatedReceipt: articles.IArticleCreate) => {
    if (id) {
      try {
        await editArticle(id, updatedReceipt);
        setArticle(await getArticle(id));
        setOpenEditor(false);
      } catch (error) {
        setServerError(dispatch, { withRedirect: false, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] });
      }
    }
  }

  const handleClickDelete = () => {
    setOpenDeleteDialog(true);
  }

  const processAgreedDelete = async () => {
    if (id) {
      try {
        await deleteArticle(id);
        setOpenDeleteDialog(true);
        handleClickBack()
      } catch (error) {
        setServerError(dispatch, { withRedirect: false, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] });
      }
    }
  }

  const renderContentBody = () => {
    if ((!categoryId || !id) || !isArticle) {
      setWebError(dispatch, { withRedirect: true, errors: ['Incorrect Url. Accept "/categories/:id/read/(receipt|article)/:id"']});
      return (
        <ReaderContentBlockTitle>Please, select Receipt or Article</ReaderContentBlockTitle>
      )
    }

    if (isArticle && article) {
      return (
        <>
          <ReaderContentBlockTopContainer>
            <ButtonBase onClick={handleClickBack}>Go back</ButtonBase>
            <ReaderContentBlockTitle>Article "{article.title}"</ReaderContentBlockTitle>
            <ButtonContainer>
              {state.isAdmin ? (
                <>
                  <EditButton onClick={handleClickEdit}>Edit Receipt</EditButton>
                  <DeleteButton onClick={handleClickDelete}>Delete Receipt</DeleteButton>
                </>
              ) : null}
              </ButtonContainer>
          </ReaderContentBlockTopContainer>
          <BreadCrumps categoryId={categoryId} />
          <ReaderContentBlockContent>
            <ReaderContentBlockContentImage src="/close-up-article-5721167.jpeg" placeholder="Article Image" />
            <ReaderContentBlockTextBlock>
              <ReaderContentBlockContentText>{article.shortDescription}</ReaderContentBlockContentText>
              <ReaderContentBlockContentText>{article.longDescription}</ReaderContentBlockContentText>
            </ReaderContentBlockTextBlock>
          </ReaderContentBlockContent>
        </>
      )
    }
    return (
      <ReaderContentBlockTitle>Loading...</ReaderContentBlockTitle>
    )
  }

  if ((!categoryId || !id) || !isArticle) {
    setWebError(dispatch, { withRedirect: true, errors: ['Incorrect Url. Accept "/categories/:id/read/(receipt|article)/:id"']});
    return (
      <ReaderContentBlockTitle>Please, select Receipt</ReaderContentBlockTitle>
    )
  }


  return (
    <ReaderContainer>
      <Modal
        show={openDeleteDialog}
        type="warning"
        name={`Are you sure want to delete '${article ? article.title : 'Article'}'?`}
        onOK={processAgreedDelete}
        onCancel={() => setOpenDeleteDialog(false)}
      >
        <p>This Step can't cancel</p>
      </Modal>
      <ArticleEditor selectedCategoryId={categoryId} initialData={article} open={openEditor} onCancel={() => setOpenEditor(false)} onCreate={handleOnSaveChanges} />
      <ReaderContentBlock>
        {renderContentBody()}
      </ReaderContentBlock>
    </ReaderContainer>
  )
}

export default ReaderPage