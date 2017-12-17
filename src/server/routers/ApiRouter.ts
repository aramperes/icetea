import {Router} from "../WebServer";
import ApiUsers from "./api/users/ApiUsers";

export default class ApiRouter extends Router {
    constructor() {
        super('/api');

        this.get('/users', (req, res) => {
            ApiUsers.listUsers(req, res);
        });

        this.get('/users/:id', (req, res) => {
            ApiUsers.getUser(req, res);
        });

        this.post('/users', (req, res) => {
            ApiUsers.createUser(req, res);
        });

        this.get('*', (req, res) => {
            res.send('This is the API route.');
        });
    }
}
