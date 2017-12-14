import {ConfigurationLoader} from "./util/configuration";
import WebServer from "./server/WebServer";
import IndexRouter from './server/routers/IndexRouter';
import ApiRouter from "./server/routers/ApiRouter";
import MongoConnector from "./db/MongoConnector";

let server = <WebServer> null;
let shutdown = function (code = 0) {
    if (server) {
        server.close();
    }
    process.exit(code);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('SIGKILL', shutdown);

console.log("Welcome to Ice Tea");
console.log("Loading configuration");

const config = new ConfigurationLoader().loadConfiguration();
console.log("port: " + config.port);
console.log("database: " + config.mongodb.host + ":" + config.mongodb.port + "/" + config.mongodb.database.name + " (auth:" + config.mongodb.database.auth + ")");

console.log("Connecting to database...");

const mongo = new MongoConnector(config.mongodb);
mongo.connect((err) => {
    if (err) {
        console.error('Failed to connect to MongoDB database: ' + err.message);
        process.exit(1);
        return;
    }
    console.log("Connected to database");

    /* user creation demo

        let user = new UserSchema();
        user.name = "Momo";
        user.email = "momo@momo.com";
        user.set_password("abc");

        mongo.insert(user, (err, result) => {
            if (err) {
                throw err;
            }
        });

    */
    server = startWebServer();
});

function startWebServer() {
    console.log("Starting server...");
    return new WebServer(__dirname, config).static().router(new ApiRouter).router(new IndexRouter).listen(() => {
        console.log("Open to connections")
    }, (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error('Failed to start server, port ' + err.port + ' is already in use.');
            process.exit(1);
        }
    });
}
