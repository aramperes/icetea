import { ConfigurationLoader } from "./configuration";

console.log("Welcome to Ice Tea.");
console.log("Loading configuration...");

var config = new ConfigurationLoader().loadConfiguration();
console.log("port: " + config.port);
