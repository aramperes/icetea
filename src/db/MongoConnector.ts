import {IMongoConfiguration} from "../util/configuration";
import Schema from "./schema/Schema";
import {
    Db,
    DeleteWriteOpResultObject,
    InsertOneWriteOpResult,
    MongoClient,
    MongoError,
    UpdateWriteOpResult
} from "mongodb";

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

    insertOne(schema: Schema, callback: (err: MongoError, result: InsertOneWriteOpResult) => void): void {
        let insertObject = {};
        schema.write(insertObject);
        for (let key of Object.keys(insertObject)) {
            if (insertObject[key] === undefined || key === "_id") {
                delete insertObject[key];
            }
        }
        this._client.collection(schema.schema_name, (err, collection) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            collection.insertOne(insertObject, (err, result) => {
                callback(err, result);
            });
        });
    }

    getAll<T extends Schema>(schema: T, callback: (err: MongoError, result: Array<T>) => void): void {
        let getObject = {};
        schema.write(getObject);
        for (let key of Object.keys(getObject)) {
            if (getObject[key] === undefined) {
                delete getObject[key];
            }
        }
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
                    let rs = schema.createInstance();
                    rs.read(result[i]);
                    result[i] = rs;
                }
                callback(err, result);
            });
        });
    }

    getOne<T extends Schema>(schema: T, callback: (err: MongoError, result: T) => void): void {
        let getObject = {};
        schema.write(getObject);
        for (let key of Object.keys(getObject)) {
            if (getObject[key] === undefined) {
                delete getObject[key];
            }
        }
        this._client.collection(schema.schema_name, (err, collection) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            collection.findOne(getObject, (err, result) => {
                if (err) {
                    callback(err, undefined);
                    return;
                }
                if (result) {
                    let resultSchema = schema.createInstance();
                    resultSchema.read(result);
                    result = resultSchema;
                }
                callback(err, result);
            });
        });
    }

    updateOne(schema: Schema, update: object, callback: (err: MongoError, result: UpdateWriteOpResult) => void): void {
        let getObject = {};
        schema.write(getObject);
        for (let key of Object.keys(getObject)) {
            if (getObject[key] === undefined) {
                delete getObject[key];
            }
        }
        this._client.collection(schema.schema_name, (err, collection) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            collection.updateOne(getObject, update, (err, result) => {
                callback(err, result);
            });
        });
    }

    deleteOne(schema: Schema, callback: (err: MongoError, result: DeleteWriteOpResultObject) => void): void {
        let getObject = {};
        schema.write(getObject);
        for (let key of Object.keys(getObject)) {
            if (getObject[key] === undefined) {
                delete getObject[key];
            }
        }
        this._client.collection(schema.schema_name, (err, collection) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            collection.deleteMany(getObject, (err, result) => {
                callback(err, result);
            });
        });
    }
}
