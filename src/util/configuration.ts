import * as fs from "fs";
import * as path from "path";

export interface IConfiguration {
  port: number;
}

export class ConfigurationLoader {
  config_file_name: string;

  constructor(config_file_name: string = "config.json") {
    this.config_file_name = config_file_name;
  }

  loadConfiguration(): IConfiguration {
    var config_path = path.join(__dirname, "..", this.config_file_name);
    if (!fs.existsSync(config_path)) {
      console.error("Could not find 'config.json' file in root directory.");
      console.error("Make sure you rename 'default-config.json' to 'config.json' before using Ice Tea.");
      process.exit(1);
    }
    var config = require(config_path);
    return <IConfiguration> config;
  }
}
