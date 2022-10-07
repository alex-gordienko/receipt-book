declare namespace categories {
  interface IDBCategory {
    title: string;
    parentId: ObjectId | null;
    status: 'active' | 'archived';

    createdAt: Date;
    updatedAt: Date;
  }

  interface ICategoryTree extends IDBCategory {
    childs: ICategoryTree[];
  }

  interface ICategoryCreate extends Pick<IDBCategory, 'title'> {
    parentId?: string | null;
   }

  interface ICategoryEdit extends Partial<ICategoryCreate> { }
}