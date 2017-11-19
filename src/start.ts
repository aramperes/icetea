import { ConfigurationLoader } from "./util/configuration";
import WebServer, { Router } from "./server/webserver";
import TestRouter from "./server/routers/TestRouter";

console.log("Welcome to Ice Tea.");
console.log("Loading configuration...");

var config = new ConfigurationLoader().loadConfiguration();
console.log("port: " + config.port);
console.log("database: " + config.database.host + ":" + config.database.port);

console.log("Starting server");

var web = new WebServer(config).router(new TestRouter).listen();
