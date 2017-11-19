import * as express from "express";
import { Router as ERouter } from "express";
import { IConfiguration } from "../util/configuration";

export default class WebServer {
  public app: any;
  private _config: IConfiguration;

  constructor(config: IConfiguration) {
    this._config = config;
    this.app = express();
  }

  router(router: Router): WebServer {
    if (!router) {
      return this;
    }
    this.app.use(router.path, router._router);
    return this;
  }

  listen(callback: Function = undefined): WebServer {
    this.app.listen(this._config.port, callback);
    return this;
  }
}

export class Router {
  path: string;
  _router: ERouter = new ERouter();

  constructor(path: string) {
    this.path = path;
  }

  get(path: string, handler: (req: any, res: any, next: any) => void): Router {
    this._router.get(path, handler);
    return this;
  }
}
