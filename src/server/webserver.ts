import * as express from "express";
import { IConfiguration } from "../util/configuration";

export default class WebServer {
  public app: any;
  private _config: IConfiguration;

  constructor(config: IConfiguration) {
    this._config = config;
    this.app = express();
  }

  routeGet(route: string, call: Function): WebServer {
    this.app.get(route, call);
    return this;
  }

  listen(callback: Function = undefined): WebServer {
    this.app.listen(this._config.port, callback);
    return this;
  }
}
