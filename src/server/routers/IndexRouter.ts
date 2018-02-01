import {Router} from "../WebServer";
import {renderToString} from "react-dom/server";
import App from "../../web/components/App";
import * as React from "react";
import IceTeaContainer from "../../web/components/IceTeaContainer";
import Home from "../../web/components/Home";
import UserSchema from "../../db/schema/UserSchema";
import {mongo} from "../../start";
import {ObjectID} from "bson";
import {Request} from "express";
import Login from "../../web/components/Login";

export default class IndexRouter extends Router {
    constructor() {
        super('/');
        this.get('/login', (req, res) => {
            if (req['_icetea'].isAuthenticated()) {
                // already logged-in, redirect to home
                res.redirect(req.url);
            } else {
                let render = IndexRouter.renderWithContainer(req, "Login",
                    React.createElement(Login));
                res.send(render);
            }
        });
        this.get('/', (req, res) => {
            let sendHome = function (userSchema: UserSchema) {
                let render = IndexRouter.renderWithContainer(req, "Home",
                    React.createElement(Home, {user: userSchema}));
                res.send(render);
            };
            if (req['_icetea'].isAuthenticated()) {
                let schema = new UserSchema;
                schema._id = new ObjectID(req['_icetea'].user_id);
                // todo: cache
                mongo.getOne(schema, (err, result) => {
                    if (err || !result) {
                        // something went wrong, 500 (Server Error).
                        res.status(500).json(err);
                        return;
                    }
                    sendHome(result);
                });
            } else {
                // not authenticated
                // todo: if session token is expired, show warning
                sendHome(undefined);
            }
        });
        this.get("*", (req, res) => {
            // probably an unknown route, 404
            // todo: 404 page
            res.status(404).send("404 Not Found: " + req.url);
        });
    }

    private static renderWithContainer(req: Request, title: string, child: any): string {
        return renderToString(React.createElement(App, {
            content: React.createElement(IceTeaContainer, {
                url: req.url,
                child: child
            }),
            title: title
        }));
    }
}
