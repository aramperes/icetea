import {Middleware, default as WebServer} from "../WebServer";

export default class DefaultMiddleware extends Middleware {
    middleware(server: WebServer): (req, res, next: () => void) => void {
        return (req, res, next) => {
            req["_icetea"] = {};
            next();
        };
    }
}
