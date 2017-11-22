import { ConfigurationLoader } from "./util/configuration";
import WebServer, { Router } from "./server/webserver";
import IndexRouter from './server/routers/IndexRouter';
import ApiRouter from "./server/routers/ApiRouter";
import MongoConnector from "./db/MongoConnector";

console.log("Welcome to Ice Tea");
console.log("Loading configuration");

var config = new ConfigurationLoader().loadConfiguration();
console.log("port: " + config.port);
console.log("database: " + config.mongodb.host + ":" + config.mongodb.port + "/" + config.mongodb.database.name + " (auth:" + config.mongodb.database.auth + ")");

console.log("Connecting to database...");

var mongo = new MongoConnector(config.mongodb);
mongo.connect((err) => {
  if (err) {
    console.error('Failed to connect to MongoDB database: ' + err.message);
    process.exit(1);
    return;
  }
  console.log("Connected to database")
  startWebServer();
});

function startWebServer() {
  console.log("Starting server...");
  return new WebServer(__dirname, config).static().router(new ApiRouter).router(new IndexRouter).listen(() => {
    console.log("Open to connections")
  });
}
