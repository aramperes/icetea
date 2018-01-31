import {Middleware, default as WebServer} from "../WebServer";

export default class DefaultMiddleware extends Middleware {
    middleware(server: WebServer): (req, res, next: () => void) => void {
        return (req, res, next) => {
            req["_icetea"] = {
                isAuthenticated: function () {
                    return this['user_id'] && this['session_expired'] === false;
                }
            };
            next();
        };
    }
}
