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

console.log("Welcome to icetea\n");
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
    UserSessionSchema.clearExpiredSessions((err, result) => {
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
}
