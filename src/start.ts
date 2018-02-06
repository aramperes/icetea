import {ConfigurationLoader} from "./util/configuration";
import WebServer from "./server/WebServer";
import IndexRouter from './server/routers/IndexRouter';
import ApiRouter from "./server/routers/ApiRouter";
import MongoConnector from "./db/MongoConnector";
import AuthRouter from "./server/routers/AuthRouter";
import AuthMiddleware from "./server/middleware/AuthMiddleware";
import DefaultMiddleware from "./server/middleware/DefaultMiddleware";
import UserSessionSchema from "./db/schema/UserSessionSchema";
import * as readline from "readline";
import * as path from "path";
import * as fs from "fs";
import UserSchema from "./db/schema/UserSchema";

let server = <WebServer> null;

function shutdown(code: number = 0) {
    if (server) {
        server.close(() => {
            process.exit(code);
        });
    } else {
        process.exit(code);
    }
}

function peacefulShutdown(code: number = 0) {
    console.log("Stopping server...");
    server.close(() => {
        console.log("Closing database connection...");
        mongo._client.close(() => {
            console.log("Server closed.");
            process.exit(0);
        });
    });
}

process.on('SIGINT', peacefulShutdown);
process.on('SIGTERM', peacefulShutdown);

console.debug = (message: string) => {
    console.log("debug> " + message);
};

console.log("Welcome to icetea\n");
console.log("Loading configuration");

export const config = new ConfigurationLoader().loadConfiguration();
console.log("port: " + config.port);
console.log("database: " + config.mongodb.host + ":" + config.mongodb.port + "/" + config.mongodb.database.name + " (auth:" + config.mongodb.database.auth + ")");

export const mongo = new MongoConnector(config.mongodb);

let connectToMongo = () => new Promise(resolve => {
    console.log("Connecting to database...");
    mongo.connect((err) => {
        if (err) {
            console.error('Failed to connect to MongoDB database: ' + err.message);
            process.exit(1);
            return;
        }
        console.log("Connected to database.");
        resolve();
    });
});

let clearExpiredSessions = () => new Promise(resolve => {
    console.log("Clearing expired sessions from database...");
    UserSessionSchema.clearExpiredSessions((err, result) => {
        if (err) {
            console.error("Failed to clear expired sessions: ");
            console.error(err);
        } else {
            console.log("Cleared " + result.deletedCount + " expired sessions.");
        }
        resolve();
    });
});

export let userSearchIndex = undefined;

let createSearchIndex = () => new Promise(resolve => {
    let userDataGetter = (err, index) => {
        if (err) {
            throw err;
        }
        // todo: why are there duplicates?
        mongo._client.collection('user').find({}).stream().pipe(index.feed({objectMode: true}));
        userSearchIndex = index;
    };
    require('search-index')({
        searchable: false,
        fieldOptions: {
            name: {
                searchable: true
            }
        }
    }, userDataGetter);
    resolve();
});

let startWebServer = () => new Promise(resolve => {
    console.log("Starting server...");
    server = new WebServer(__dirname, config)
        .middleware(new DefaultMiddleware)
        .middleware(new AuthMiddleware)
        .static()
        .router(new ApiRouter)
        .router(new AuthRouter)
        .router(new IndexRouter)
        .listen((s) => {
            console.log("Open to connections.");
            resolve();
        }, (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error('Failed to start server, port ' + err.port + ' is already in use.');
            } else {
                console.error('An unhandled error occurred while starting the server.');
                throw err;
            }
            process.exit(1);
        });
});

let checkDefaultAdmin = () => new Promise(resolve => {
    let admin_username = config.general.admin_username;
    if (!admin_username || admin_username.trim() === "") {
        console.warn("***" +
            "\n  Warning: Default administrator username is not set in the configuration." +
            "\n  This option is found at dist/config.json/general/admin_username." +
            "\n***");
        resolve();
        return;
    }
    let user = new UserSchema();
    user.name = admin_username;
    mongo.getOne(user, (err, result) => {
        if (err) {
            throw err;
        }
        if (!result) {
            console.warn("***" +
                "\n  Warning: Could not find default administrator '" + admin_username + "'." +
                "\n  Creating an account with this name will make it an administrator automatically." +
                "\n***");
        }
        resolve();
    });
});

let postInit = () => new Promise(resolve => {
    console.log("Enter 'stop' or 'exit' to close the server.");
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true
    });
    rl.on('line', (input) => {
        if (!input) {
            return;
        }
        input = input.trim();
        if (input.toLowerCase() === "exit" || input.toLowerCase() === "stop") {
            peacefulShutdown();
            return;
        }
        if (input.toLowerCase() === "version" || input.toLowerCase() === "about") {
            let moduleFile = path.join(__dirname, "../package.json");
            fs.exists(moduleFile, (exists) => {
                if (exists === false) {
                    console.error("Failed to retrieve module information.");
                } else {
                    let moduleInfo = require(moduleFile);
                    console.log("icetea version " + moduleInfo.version);
                }
            });
        }
    });
    /* Example search
    userSearchIndex.match({
        beginsWith: 'dem', threshold: 2, type: 'ID'
    }).on('data', (data) => {
        userSearchIndex.get(data.documents).on('data', (doc) => {
            console.log(doc);
        });
    }).on('end', () => {
        console.log('search done');
    }); */
    resolve();
});

// start server
Promise.resolve()
    .then(connectToMongo)
    .then(clearExpiredSessions)
    .then(createSearchIndex)
    .then(startWebServer)
    .then(checkDefaultAdmin)
    .then(postInit);
