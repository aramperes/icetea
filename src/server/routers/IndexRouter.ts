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

export default class IndexRouter extends Router {
    constructor() {
        super('/');
        this.get('/login', (req, res) => {
            res.redirect('/auth/login');
        });
        this.get('/', (req, res) => {
            let sendHome = function (userSchema: UserSchema) {
                let render = IndexRouter.renderWithContainer(req, "Home",
                    userSchema, React.createElement(Home, {user: userSchema}));
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

    static renderWithContainer(req: Request, title: string, user: UserSchema, child: any): string {
        return renderToString(React.createElement(App, {
            content: React.createElement(IceTeaContainer, {
                url: req.url,
                user: user,
                child: child
            }),
            title: title
        }));
    }
}
