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
  'MIIBOgIBAAJBAKmSV299k11nhI7c+kpBu9HtDwZMfkSQFaIpBngvniq5DHTBiBEA',
  'UP63mMS7fC00OABZtkq1TH4ZAVkr5ih4F30CAwEAAQJAVdhqP10Zb53qc9DXPSSO',
  'Czax9oRfICK5cQDH76xbrFBwfkiYx2JQVNTmwML/zJsHeU7WWm6oWksEFnfs9f9M',
  'gQIhAPVhy5wuHxvye2ksRwu+Cc1KJm5yvqn8K7nE5K6/3ZbxAiEAsOjC6SeqsD9S',
  'FkY8Sydeuvxlzq2IhaR72iPbSkBmwU0CIDz8MT5/t/uaKFHbT0z7zjPXWfXZTsmw',
  'gq2I4c0MomYBAiAJqTxztSnaJCscckt6ozTGK2B37/wjqD7nQ8wG+wthhQIhAIg0',
  'W0ojohefzqdJttAfxsc8oCE/3wSjsm2iPEVMx61/',
  '-----END RSA PRIVATE KEY-----',
].join('\n');