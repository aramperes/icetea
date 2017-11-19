import { ConfigurationLoader } from "./util/configuration";
import WebServer from "./server/webserver";

console.log("Welcome to Ice Tea.");
console.log("Loading configuration...");

var config = new ConfigurationLoader().loadConfiguration();
console.log("port: " + config.port);

console.log("Starting server");

function mainRoute(req, res) {
  res.send("Hello there: " + req.params.something);
}

var web = new WebServer(config).routeGet('/:something', mainRoute).listen();
