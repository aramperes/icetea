import { IMongoConfiguration } from "../util/configuration";
import { MongoClient, Db, MongoError } from "mongodb";

export default class MongoConnector {
  config: IMongoConfiguration;
  _client: Db;
  _url: string;

  constructor(config: IMongoConfiguration) {
    this.config = config;
    this._url = "mongodb://" + (config.database.auth ? (config.database.username + ":" + config.database.password + "@") : "") + config.host + ":" + config.port + "/" + config.database.name;
  }

  connect(callback: (err: MongoError, connector: MongoConnector) => void): void {
    MongoClient.connect(this._url, (err, db) => {
      this._client = db;
      callback(err, this);
    });
  }
}