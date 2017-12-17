import {Router} from "../WebServer";
import ApiUsers from "./api/users/ApiUsers";

export default class ApiRouter extends Router {
    constructor() {
        super('/api');

        /* Users API */
        this.get('/users', (req, res) => {
            ApiUsers.listUsers(req, res);
        });
        this.get('/users/:id', (req, res) => {
            ApiUsers.getUser(req, res);
        });
        this.post('/users', (req, res) => {
            ApiUsers.createUser(req, res);
        });

        /* API base route */
        this.get('/', (req, res) => {
            res.end("API: root");
        });
        this.get('*', (req, res) => {
            res.status(404).end("API: Not Found");
        });
    }
}
