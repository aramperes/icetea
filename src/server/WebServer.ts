import * as express from "express";
import {Express, RequestHandler, Router as ERouter} from "express";
import {IConfiguration} from "../util/configuration";
import * as path from "path";
import {Server} from "net";

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

export default class WebServer {
    public app: Express;
    private _root_path: string;
    private _config: IConfiguration;
    private _server: Server;

    constructor(root_path: string, config: IConfiguration) {
        this._root_path = root_path;
        this._config = config;
        this.app = express();
        // built-in middleware
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }

    router(router: Router): WebServer {
        if (!router) {
            return this;
        }
        router._setRootPath(this._root_path);
        this.app.use(router.path, router._router);
        return this;
    }

    middleware(middleware: Middleware): WebServer {
        if (!middleware) {
            return this;
        }
        let mw = middleware.middleware(this);
        this.app.use(mw);
        return this;
    }

    static(web_path: string = '/public', dir_path: string = '/public'): WebServer {
        this.app.use(web_path, express.static(path.join(this._root_path, dir_path)));
        return this;
    }

    listen(callback: (server: WebServer) => void = undefined, errCallback: (err) => void = undefined): WebServer {
        this._server = this.app.listen(this._config.port, () => {
            callback(this);
        }).on('error', (err) => {
            if (errCallback) {
                errCallback(err);
            }
        });
        return this;
    }

    root(): string {
        return this._root_path;
    }

    close(callback: () => void): void {
        if (this._server && this._server.listening) {
            this._server.close(callback);
        } else {
            callback();
        }
    }
}

export class Router {
    path: string;
    _root_path: string;
    _router: ERouter = ERouter();

    constructor(path: string) {
        this.path = path;
    }

    get(path: string, handler: RequestHandler): Router {
        this._router.get(path, handler);
        return this;
    }

    post(path: string, handler: RequestHandler): Router {
        this._router.post(path, handler);
        return this;
    }

    all(path: string, handler: RequestHandler): Router {
        this._router.all(path, handler);
        return this;
    }

    _setRootPath(root_path: string) {
        this._root_path = root_path;
    }
}

export abstract class Middleware {
    abstract middleware(server: WebServer): RequestHandler;
}
