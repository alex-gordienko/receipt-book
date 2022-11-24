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
    },
    usersDB: {
      name: 'users',
      collections: {
        accounts: 'accounts',
        users: 'users'
      }
    },
    saltDB: {
      name: 'salt',
      collections: {
        userLoginSalt: 'userLoginSalt'
      }
    }
  }
}

export const dbUri = `mongodb+srv://${config.mongo.username}:${config.mongo.password}@cluster0.hmbc935.mongodb.net/?retryWrites=true&w=majority`;

export const secret = [
  '-----BEGIN RSA PRIVATE KEY-----',
  process.env.SECRET || 'qwerty',
  '-----END RSA PRIVATE KEY-----',
].join('\n');