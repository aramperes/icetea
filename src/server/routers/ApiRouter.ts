import {Router} from "../WebServer";
import GetUsers from "./api/users/GetUsers";

export default class ApiRouter extends Router {
    constructor() {
        super('/api');

        this.get('/users', (req, res) => {
            GetUsers.listUsers(req, res);
        });

        this.get('/users/:name', (req, res) => {
            GetUsers.getUser(req, res);
        });

        this.post('/users', (req, res) => {
            GetUsers.createUser(req, res);
        });

        this.get('*', (req, res) => {
            res.send('This is the API route.');
        });
    }
}
