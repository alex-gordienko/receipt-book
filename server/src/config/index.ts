export const config: config.Config = {
  mongo: {
    username: 'api',
    password: 'qCyfKdlwutgkDevt'
  },
  databases: {
    logger: {
      name: 'logger',
      collections: {
        requests: 'requests'
      }
    },
    receiptsDB: {
      name: 'receiptsDB',
      collections: {
        articles: 'articles',
        receipts: 'receipts',
        categories: 'categories',
      }
    }
  }
}

export const dbUri = `mongodb+srv://${config.mongo.username}:${config.mongo.password}@cluster0.hmbc935.mongodb.net/?retryWrites=true&w=majority`;