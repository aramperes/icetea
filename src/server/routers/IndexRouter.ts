import {Router} from "../WebServer";
import {renderToString} from "react-dom/server";
import App from "../../web/components/App";
import * as React from "react";
import IceTeaContainer from "../../web/components/IceTeaContainer";
import Home from "../../web/components/Home";
import UserSchema from "../../db/schema/UserSchema";
import {mongo} from "../../start";
import {ObjectID} from "bson";

export default class TestRoute extends Router {
    constructor() {
        super('*');
        this.get('/', (req, res) => {
            if (req.baseUrl !== '') {
                // probably an unknown route, 404
                // todo: 404 page
                res.status(404).send("404 Not Found: " + req.baseUrl);
                return;
            }
            let sendHome = function (userSchema: UserSchema) {
                let render = renderToString(React.createElement(App, {
                    content: React.createElement(IceTeaContainer, {
                        child:
                            React.createElement(Home, {user: userSchema})
                    }),
                    title: "Home"
                }));
                res.send(render);
                res.end();
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
    }
}
