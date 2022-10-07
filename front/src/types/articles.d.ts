declare namespace articles {
  interface IDBArticles {
    _id: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    categoryId: string;

    createdAt: string;
    updatedAt: string;
  }

  interface IArticleCreate extends Pick<IDBArticles, 'title' | 'shortDescription' | 'longDescription' | 'categoryId'> { }

  interface IArticleEdit extends
    Partial<IArticleCreate> { }
}