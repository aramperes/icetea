import * as express from "express";
import { Router as ERouter } from "express";
import { IConfiguration } from "../util/configuration";
import * as path from "path";

export default class WebServer {
  public app: any;
  private _root_path: string;
  private _config: IConfiguration;

  constructor(root_path: string, config: IConfiguration) {
    this._root_path = root_path;
    this._config = config;
    this.app = express();
  }

  router(router: Router): WebServer {
    if (!router) {
      return this;
    }
    router._setRootPath(this._root_path);
    this.app.use(router.path, router._router);
    return this;
  }

  static(webpath: string = '/public', dirpath: string = '/public'): WebServer {
    this.app.use(webpath, express.static( path.join(this._root_path, dirpath) ));
    return this;
  }

  listen(callback: Function = undefined): WebServer {
    this.app.listen(this._config.port, callback);
    return this;
  }

  root(): string {
    return this._root_path;
  }
}

export class Router {
  path: string;
  _root_path: string;
  _router: ERouter = new ERouter();

  constructor(path: string) {
    this.path = path;
  }

  get(path: string, handler: (req: any, res: any, next: any) => void): Router {
    this._router.get(path, handler);
    return this;
  }

  _setRootPath(root_path: string) {
    this._root_path = root_path;
  }
}
