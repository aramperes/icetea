import {Router} from "../WebServer";
import AuthLogin from "./auth/AuthLogin";

export default class AuthRouter extends Router {

    constructor() {
        super("/auth");

        this.post("/login", (req, res) => {
            AuthLogin.executeLogin(req, res);
        });
        this.get("/login", (req, res) => {
            res.redirect('../');
        });

        /* API base route */
        this.get('/', (req, res) => {
            res.end("Auth: root");
        });
        this.get('*', (req, res) => {
            res.status(404).end("Auth: Not Found");
        });
    }
}
