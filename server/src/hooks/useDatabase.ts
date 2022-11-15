import { Collection, MongoClient, Db, ServerApiVersion } from 'mongodb';
import { createClient, RedisClientType, RedisModules, RedisFunctions, RedisScripts } from 'redis';
import { config, dbUri } from '../config';

class DataBaseConnector {
  private _loggerPool: Db | undefined;
  private _connectionPool: Db | undefined;
  private _receiptsDatabase: Collection<receipts.IDBReceipt> | undefined;
  private _categoriesDatabase: Collection<categories.IDBCategory> | undefined;
  private _articlesDatabase: Collection<articles.IDBArticles> | undefined;
  private _usersDatabase: Collection<user.IUserDB> | undefined;
  private _accountsDatabase: Collection<user.IAccountDB> | undefined;
  private _saltDatabase: Collection<user.ILoginSaltPair> | undefined;
  private redis: RedisClientType<RedisModules, RedisFunctions, RedisScripts> | undefined;

  get loggerPool() {
    return this._loggerPool!;
  }
  get connectionPool() {
    return this._connectionPool!;
  }
  get receiptsDatabase() {
    return this._receiptsDatabase!;
  }
  get categoriesDatabase() {
    return this._categoriesDatabase!;
  }
  get articlesDatabase() {
    return this._articlesDatabase!;
  }
  get usersDatabase() {
    return this._usersDatabase!;
  }
  get accountsDatabase() {
    return this._accountsDatabase!
  }
  get saltDatabase() {
    return this._saltDatabase!
  }
  get redisClient() {
    return this.redis!
  }

  public async init() {
    try {
      if (!this.redis) {
        const redisClient = createClient();
        await redisClient.connect();
        this.redis = redisClient;
      }
      if (!this._connectionPool) {
        const mongoClient = new MongoClient(dbUri, { serverApi: ServerApiVersion.v1 });
        await mongoClient.connect();
      
        this._connectionPool = mongoClient
          .db(config.databases['receiptsDB'].name);
      
        this._loggerPool = mongoClient
          .db(config.databases['logger'].name);
    
        this._receiptsDatabase = this._connectionPool
          .collection<receipts.IDBReceipt>(config.databases['receiptsDB'].collections['receipts']);
      
        this._categoriesDatabase = this._connectionPool
          .collection<categories.IDBCategory>(config.databases['receiptsDB'].collections['categories']);
      
        this._articlesDatabase = this._connectionPool
          .collection<articles.IDBArticles>(config.databases['receiptsDB'].collections['articles']);
        
        this._usersDatabase = mongoClient
          .db(config.databases['usersDB'].name)
          .collection<user.IUserDB>(config.databases['usersDB'].collections['users']);
        
        this._accountsDatabase = mongoClient
          .db(config.databases['usersDB'].name)
          .collection<user.IAccountDB>(config.databases['usersDB'].collections['accounts']);
        
        this._saltDatabase = mongoClient
          .db(config.databases['saltDB'].name)
          .collection<user.ILoginSaltPair>(config.databases['saltDB'].collections['userLoginSalt'])
      }
    } catch (error) {
      console.log('Error while starting server', error);
      setTimeout(()=> this.init(), 10000)
    }
  }
}

export const useDatabase = new DataBaseConnector();