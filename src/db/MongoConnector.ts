import {IMongoConfiguration} from "../util/configuration";
import Schema from "./schema/Schema";
import {MongoClient, Db, MongoError, InsertOneWriteOpResult} from "mongodb";

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

    insert(schema: Schema, callback: (err: MongoError, result: InsertOneWriteOpResult) => void): void {
        this._client.collection(schema.schema_name, (err, collection) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            collection.insertOne(schema, (err, result) => {
                callback(err, result);
            });
        });
    }
}