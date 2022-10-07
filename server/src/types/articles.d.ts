declare namespace articles {
  interface IDBArticles {
    title: string;
    shortDescription: string;
    longDescription: string;
    categoryId: ObjectId;

    createdAt: Date;
    updatedAt: Date;
  }

  interface IArticleCreate extends Pick<IDBArticles, 'title' | 'shortDescription' | 'longDescription'> {
    categoryId: string;
  }

  interface IArticleEdit extends
    Partial<IArticleCreate> { }
}