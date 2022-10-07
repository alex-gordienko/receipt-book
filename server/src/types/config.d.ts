declare namespace config {
  type DatabaseConfig = {
    name: string;
    collections: {
      [collName: string]: string;
    }
  }
  
  type Config = {
    mongo: {
      username: string;
      password: string;
    }
    databases: {
      [dbName: string]: DatabaseConfig
    }
  }
}