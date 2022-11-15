declare namespace categories {
  interface IDBCategory {
    _id: string;
    title: string;
    parentId: string | null;
    status?: 'active' | 'archived';

    likes?: number;

    createdAt: string;
    updatedAt: string;
  }

  interface ICategoryTree extends IDBCategory {
    childs: ICategoryTree[];
  }

  interface ICategoryCreate extends Pick<IDBCategory, 'title' | 'parentId'> {}

  interface ICategoryEdit extends Partial<ICategoryCreate> { }
}