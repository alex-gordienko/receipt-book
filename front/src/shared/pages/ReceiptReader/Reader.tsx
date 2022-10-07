import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from '../../../store';
import { setServerError, setWebError } from "../../../store/actions";
import { ButtonBase, EditButton, DeleteButton, ButtonContainer } from "../../../styles/globalParams";
import BreadCrumps from "../../components/BreadCrumps";
import ReceiptEditor from "../../components/editors/ReceiptEditor";
import { getReceipt, editReceipt, isRequestError, deleteReceipt } from "../../helpers/httpConnector";
import Modal from '../../components/Modal';
import {
  ReaderContainer,
  ReaderContentBlock,
  ReaderContentBlockTopContainer,
  ReaderContentBlockTitle,
  ReaderContentBlockContent,
  ReaderContentBlockContentText,
  ReaderContentBlockContentImage
} from "./styled";

const ReaderPage: React.FC<{}> = () => {
  const { state, dispatch } = useContext(AppContext);
  const { categoryId, id } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<receipts.IDBReceipt>();
  const [openEditor, setOpenEditor] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  const routePath = window.location.pathname.split('/');
  const isReceipt = routePath.includes('receipt');

  const loadReceipt = async () => {
    if (isReceipt && id && !receipt) {
      try {
        setReceipt(await getReceipt(id));
      } catch (error) {
        setServerError(dispatch, { withRedirect: true, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] });
      }
    }
  }

  useEffect(() => {
    loadReceipt();
  }, [dispatch, id, isReceipt, receipt]);

  const handleClickBack = () => {
    const pathTo = `/categories/${categoryId}?articlesPage=${state.pageArticles}&receiptsPage=${state.pageReceipts}`;
    navigate(state.isAdmin ? '/admin' + pathTo : pathTo);
  }

  const handleClickEdit = () => {
    setOpenEditor(true);
  }

  const handleOnSaveChanges = async (updatedReceipt: receipts.IReceiptCreate) => {
    if (id) {
      try {
        await editReceipt(id, updatedReceipt);
        setReceipt(await getReceipt(id));
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
        await deleteReceipt(id);
        setOpenDeleteDialog(false);
        handleClickBack()
      } catch (error) {
        setServerError(dispatch, { withRedirect: false, errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] });
      }
    }
  }

  const renderContentBody = () => {
    if ((!categoryId || !id) || !isReceipt) {
      setWebError(dispatch, { withRedirect: true, errors: ['Incorrect Url. Accept "/categories/:id/read/(receipt|article)/:id"']});
      return (
        <ReaderContentBlockTitle>Please, select Receipt</ReaderContentBlockTitle>
      )
    }

    if (isReceipt && receipt) {
      return (
        <>
          <ReaderContentBlockTopContainer>
            <ButtonBase onClick={handleClickBack}>Go back</ButtonBase>
            <ReaderContentBlockTitle>Receipt "{receipt.title}"</ReaderContentBlockTitle>
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
            <ReaderContentBlockContentImage src="/shutterstock_314686445.jpeg" placeholder="Receipt Image" />
            <ReaderContentBlockContentText>{receipt.description.split('\n').map((textPart: string, indx: number) => (<p key={indx}>{textPart}</p>))}</ReaderContentBlockContentText>
          </ReaderContentBlockContent>
        </>
      )
    }

    return (
      <ReaderContentBlockTitle>Loading...</ReaderContentBlockTitle>
    )
  }

  if ((!categoryId || !id) || !isReceipt) {
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
        name={`Are you sure want to delete '${receipt ? receipt.title : 'Receipt'}'?`}
        onOK={processAgreedDelete}
        onCancel={() => setOpenDeleteDialog(false)}
      >
        <p>This Step can't cancel</p>
      </Modal>
      <ReceiptEditor selectedCategoryId={categoryId} initialData={receipt} open={openEditor} onCancel={() => setOpenEditor(false)} onCreate={handleOnSaveChanges} />
      <ReaderContentBlock>
        {renderContentBody()}
      </ReaderContentBlock>
    </ReaderContainer>
  )
}

export default ReaderPage