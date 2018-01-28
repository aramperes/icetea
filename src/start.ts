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

let server = <WebServer> null;
let shutdown = function (code = 0) {
    if (server) {
        server.close(() => {
            process.exit(code);
        });
    } else {
        process.exit(code);
    }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log("Welcome to Ice Tea");
console.log("Loading configuration");

const config = new ConfigurationLoader().loadConfiguration();
console.log("port: " + config.port);
console.log("database: " + config.mongodb.host + ":" + config.mongodb.port + "/" + config.mongodb.database.name + " (auth:" + config.mongodb.database.auth + ")");

console.log("Connecting to database...");

export const mongo = new MongoConnector(config.mongodb);
mongo.connect((err) => {
    if (err) {
        console.error('Failed to connect to MongoDB database: ' + err.message);
        process.exit(1);
        return;
    }
    console.log("Connected to database.");
    clearExpiredSessions();
});

function clearExpiredSessions() {
    console.log("Clearing expired sessions from database...");
    let currentTime = Date.now();
    let query = new UserSessionSchema();
    query['expirationTimestamp' + ''] = {$lt: currentTime}; // lower than current time
    mongo.deleteAll(query, (err, result) => {
        if (err) {
            console.error("Failed to clear expired sessions: ");
            console.error(err);
        } else {
            console.log("Cleared " + result.deletedCount + " expired sessions.");
        }
        server = startWebServer();
    });
}

function startWebServer() {
    console.log("Starting server...");
    return new WebServer(__dirname, config)
        .middleware(new DefaultMiddleware)
        .middleware(new AuthMiddleware)
        .static()
        .router(new ApiRouter)
        .router(new AuthRouter)
        .router(new IndexRouter)
        .listen((server) => {
            server.
            console.log("Open to connections.");
            postInit();
        }, (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error('Failed to start server, port ' + err.port + ' is already in use.');
            } else {
                console.error('An unhandled error occurred while starting the server.');
                throw err;
            }
            process.exit(1);
        });
}

function postInit() {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true
    });
    rl.setPrompt('> ');
    rl.on('line', (input) => {
        if (!input) {
            rl.prompt();
            return;
        }
        input = input.trim();
        if (input.toLowerCase() === "exit" || input.toLowerCase() === "stop") {
            console.log("Stopping server...");
            server.close(() => {
                console.log("Closing database connection...");
                mongo._client.close(() => {
                    console.log("Server closed.");
                    process.exit(0);
                });
            });
        }
    });
    rl.prompt();
}
