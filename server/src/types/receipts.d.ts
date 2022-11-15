declare namespace receipts {
  interface IDBReceipt {
    title: string;
    description: string;
    categoryId: ObjectId;

    likes: number;

    createdAt: Date;
    updatedAt: Date;
  }

  interface IReceiptCreate extends Pick<receipts.IDBReceipt, 'title' | 'description'> {
    categoryId: string;
  }
  
  interface IReceiptEdit extends
    Partial<IReceiptCreate> { }
}