import { DeleteResult, ObjectId, WithId } from "mongodb";
import { notFound, badRequest } from "../../helpers/responses";
import { useDatabase } from "../../hooks/useDatabase";

class ReceiptsModel {
  public async findById(id: ObjectId): Promise<WithId<receipts.IDBReceipt> | null> {
    return useDatabase.receiptsDatabase.findOne({ _id: id });
  }

  public async findByIdWithCheck(id: ObjectId): Promise<WithId<receipts.IDBReceipt>> {
    const receipt = await this.findById(id);

    if (!receipt) {
      throw notFound(`Can't find receipt by ID = ${id}`);
    }

    return receipt
  }

  public async findByName(title: string): Promise<WithId<receipts.IDBReceipt> | null>{
    return useDatabase.receiptsDatabase.findOne({ title });
  }

  public async findByNameWithCheck(title: string): Promise<WithId<receipts.IDBReceipt>>{
    const receipt = await useDatabase.receiptsDatabase.findOne({ title });

    if (!receipt) {
      throw notFound(`Can't find receipt by title = ${title}`);
    }

    return receipt
  }

  public async listByCategory(categoryId: ObjectId, reqPage?: string, reqPageSize?: string) {
    const page = Number(reqPage || 0);
    const pageSize = Number(reqPageSize || 20);

    const receiptsCount = await useDatabase.receiptsDatabase.countDocuments({ categoryId });
    const receipts = await useDatabase.receiptsDatabase
      .find({ categoryId })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    
    return {
      items: receipts,
      totalCount: receiptsCount
    }
  }

  public async checkReceiptCategory (categoryId: ObjectId) {
    const isCategoryValid = await useDatabase.categoriesDatabase.findOne({ _id: categoryId });
    if (!isCategoryValid) {
      throw badRequest(`Category with ID = ${categoryId} is not exist`); 
    }
    return isCategoryValid
  }

  public async createNewReceipt(receipt: receipts.IReceiptCreate, categoryId: ObjectId): Promise<WithId<receipts.IDBReceipt>> {
    const newReceiptData = {
      ...receipt,
      categoryId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const newReceipt = await useDatabase.receiptsDatabase.insertOne(newReceiptData);
    return { ...newReceiptData, _id: new ObjectId(newReceipt.insertedId) }
  }

  public async updateReceipt (receipt: WithId<receipts.IDBReceipt>, dataToUpdate: receipts.IReceiptEdit) {
    const updated = await useDatabase.receiptsDatabase.updateOne(
      { _id: receipt._id },
      { $set: {
        ...dataToUpdate,
        categoryId: dataToUpdate.categoryId ? new ObjectId(dataToUpdate.categoryId) : receipt.categoryId,
        updatedAt: new Date()
      }}
    );
    return updated
  }
  public async deleteReceipt (receiptId: ObjectId): Promise<DeleteResult> {
    const deleteReceipt = await useDatabase.receiptsDatabase.deleteOne({ _id: receiptId });

    return deleteReceipt
  }

  public async deleteReceiptsByCategoryId(categoryId: ObjectId): Promise<DeleteResult> {
    return useDatabase.receiptsDatabase.deleteMany({ categoryId });
  }
}

export const receiptsModel = new ReceiptsModel();