declare namespace receipts {
  interface IDBReceipt {
    _id: string;
    title: string;
    description: string;
    categoryId: string;

    likes?: number;

    createdAt: string;
    updatedAt: string;
  }

  interface IReceiptCreate extends Pick<receipts.IDBReceipt, 'title' | 'description' | 'categoryId'> { }
  
  interface IReceiptEdit extends
    Partial<IReceiptCreate> { }
}