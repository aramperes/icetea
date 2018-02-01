import * as fs from "fs";
import * as path from "path";

export interface IConfiguration {
    port: number;
    general: IGeneralConfiguration;
    mongodb: IMongoConfiguration;
}

export interface IMongoConfiguration {
    host: string;
    port: number;
    database: IMongoDatabaseConfiguration;
}

export interface IMongoDatabaseConfiguration {
    name: string;
    auth: boolean;
    username: string;
    password: string;
}

export interface IGeneralConfiguration {
    open_registration: boolean; // whether registration is open to anyone (true) or only admins (false)
    admin_username: string; // username of the default administrator, to be registered
}

export class ConfigurationLoader {
    config_file_name: string;

    constructor(config_file_name: string = "config.json") {
        this.config_file_name = config_file_name;
    }

    loadConfiguration(): IConfiguration {
        let config_path = path.join(__dirname, "..", this.config_file_name);
        if (!fs.existsSync(config_path)) {
            console.error("Could not find 'config.json' file in the 'dist' directory.");
            console.error("Make sure you rename 'default-config.json' to 'config.json' before using Ice Tea.");
            process.exit(1);
        }
        let config = require(config_path);
        return <IConfiguration> config;
    }
}
