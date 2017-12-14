import {IMongoConfiguration} from "../util/configuration";
import Schema from "./schema/Schema";
import {Db, InsertOneWriteOpResult, MongoClient, MongoError} from "mongodb";

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

    getAll<T extends Schema>(schema: T, callback: (err: MongoError, result: Array<T>) => void): void {
        this._client.collection(schema.schema_name, (err, collection) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            collection.find({}).toArray((err, result) => {
                if (err) {
                    callback(err, undefined);
                    return;
                }
                for (let i = 0; i < result.length; i++) {
                    result[i] = schema.read(result[i]);
                }
                callback(err, result);
            });
        });
    }

    getOne<T extends Schema>(schema: T, callback: (err: MongoError, result: T) => void): void {
        this._client.collection(schema.schema_name, (err, collection) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            collection.findOne(schema, (err, result) => {
                if (err) {
                    callback(err, undefined);
                    return;
                }
                callback(err, result);
            });
        });
    }
}
