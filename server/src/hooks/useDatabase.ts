import { Collection, MongoClient, Db, ServerApiVersion } from 'mongodb';
import { createClient, RedisClientType, RedisModules, RedisFunctions, RedisScripts } from 'redis';
import { config, dbUri } from '../config';

class DataBaseConnector {
  private _loggerPool: Db | undefined;
  private _connectionPool: Db | undefined;
  private _receiptsDatabase: Collection<receipts.IDBReceipt> | undefined;
  private _categoriesDatabase: Collection<categories.IDBCategory> | undefined;
  private _articlesDatabase: Collection<articles.IDBArticles> | undefined;
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
  get redisClient() {
    return this.redis!
  }

  public async init() {
    const mongoClient = new MongoClient(dbUri, { serverApi: ServerApiVersion.v1 });
    try {
      const redisClient = createClient();
      await redisClient.connect();
      await mongoClient.connect();

      this.redis = redisClient;
      
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
    } catch (error) {
      console.log('Error while starting server', error);
      setTimeout(()=> this.init(), 10000)
    }
  }
}

export const useDatabase = new DataBaseConnector();