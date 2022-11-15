import { RequestHandler } from 'express';
import { ObjectId, WithId } from 'mongodb';
import { badRequest } from '../../helpers/responses';
import { isValidObjectID } from '../../validators/mongo-id.validator';
import { receiptsModel } from './receipts.models';
import { receiptsSocketEvents } from './receipts.socketEvents';
import { validateCreationReceipt, validateEditReceipt } from './receipts.validator';

type GetReceipt = RequestHandler<{ id: string }, WithId<receipts.IDBReceipt>, {}, {}>;
type GetReceiptsOfCategory = RequestHandler<{ id: string }, { totalCount: number; items: WithId<receipts.IDBReceipt>[] }, {}, { page: string, pageSize: string }>;
type CreateReceipt = RequestHandler<{}, WithId<receipts.IDBReceipt>, receipts.IReceiptCreate, {}>;
type EditReceipt = RequestHandler<{ id: string }, WithId<receipts.IDBReceipt>, receipts.IReceiptEdit, {}>;
type LikeReceipt = RequestHandler<{ id: string }, {}, {}, {}>;
type DeleteReceipt = RequestHandler<{ id: string }, {}, {}, {}>;

class ReceiptsController {
  public getReceipt: GetReceipt = async (req, res) => {

    if (!isValidObjectID(req.params.id)) {
      throw badRequest('Receipt Id is incorrect');
    }
    const receipt = await receiptsModel.findByIdWithCheck(new ObjectId(req.params.id));

    res.send(receipt);
  };

  public getReceiptsByCategory: GetReceiptsOfCategory = async (req, res) => {
    if (!isValidObjectID(req.params.id)) {
      throw badRequest('Category Id is incorrect');
    }      

    const result = await receiptsModel.listByCategory(new ObjectId(req.params.id), req.query.page, req.query.pageSize);

    res.send(result);
  };

  public createReceipt: CreateReceipt = async (req, res) => {
    const requestReceipt = req.body as receipts.IReceiptCreate;
    
    const isCategoryValid = await validateCreationReceipt(requestReceipt);

    const newReceipt = await receiptsModel.createNewReceipt(requestReceipt, isCategoryValid._id);

    receiptsSocketEvents.broadcastSendCallToCreate(newReceipt.categoryId.toString(), newReceipt._id.toString());

    res.status(200).send(newReceipt);
  }

  public editReceipt: EditReceipt = async (req, res) => {
    if (!isValidObjectID(req.params.id)) {
      throw badRequest('Receipt Id should be provided');
    }

    const receiptId = new ObjectId(req.params.id);
    const requestReceipt = req.body as receipts.IReceiptEdit;

    await validateEditReceipt(requestReceipt);

    const existedReceipt = await receiptsModel.findByIdWithCheck(receiptId);

    const editedReceipt = await receiptsModel.updateReceipt(existedReceipt, requestReceipt);

    receiptsSocketEvents.broadcastSendCallToUpdate(req.params.id);

    res.status(200).send(editedReceipt);
  }

  public likeReceipt: LikeReceipt = async (req, res) => {
    if (!isValidObjectID(req.params.id)) {
      throw badRequest('Category Id should be provided');
    }
    
    receiptsModel.likeCategory(req.params.id);

    receiptsSocketEvents.broadcastSendCallToLike(req.params.id);

    res.sendStatus(200);
  }

  public deleteReceipt: DeleteReceipt = async (req, res) => {

    if (!isValidObjectID(req.params.id)) {
      throw badRequest('Receipt Id should be provided');
    }

    const receiptId = new ObjectId(req.params.id);

    const deleteReceipt = await receiptsModel.deleteReceipt(receiptId);

    receiptsSocketEvents.broadcastSendCallToDelete(req.params.id);

    res.status(200).send(deleteReceipt);
  }
}

export const receiptsController = new ReceiptsController();