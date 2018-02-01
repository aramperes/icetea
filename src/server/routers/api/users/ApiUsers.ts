import {config, mongo} from "../../../../start";
import UserSchema from "../../../../db/schema/UserSchema";
import {ObjectID} from "bson";

export default class ApiUsers {
    private constructor() {
    }

    static listUsers(req, res): void {
        // list users
        mongo.getAll(new UserSchema, (err, result) => {
            if (err) {
                res.json(err);
            } else {
                res.json(result);
            }
        });
    }

    static createUser(req, res): void {
        // create user
        let content = req.body;
        let result = {
            success: false,
            message: "Content is invalid, expected an object."
        };
        const required_fields = {
            'name': 'string',
            'email': 'string',
            'password': 'string'
        };

        // validate input
        if (!content || typeof content != "object") {
            res.status(400).json(result);
            return;
        }

        for (let field in required_fields) {
            if (!(field in content)) {
                result.message = "Required field '" + field + "' is missing.";
                res.status(400).json(result);
                return;
            }
            if (typeof content[field] != required_fields[field]) {
                result.message = "Field '" + field + "' is of type " + (typeof content[field]) +
                    " (" + JSON.stringify(content[field]) + "), expected " + required_fields[field];
                res.status(400).json(result);
                return;
            }
        }

        // todo: check if registration is open

        // check if there is already a user with that name
        let schema = new UserSchema;
        schema.name = content.name;
        mongo.getOne(schema, (err, user) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            if (user) {
                result.message = "There is already a user with the name '" + content['name'] + "' (" + user._id + ").";
                res.status(400).json(result);
                return;
            }
            let is_admin = false;
            let create = function () {
                schema.email = content.email;
                schema.is_admin = is_admin;
                schema.set_password(content.password);
                mongo.insertOne(schema, (err, mongoResult) => {
                    if (err) {
                        res.status(500).json(err);
                        return;
                    }
                    result.success = true;
                    result.message = "User created successfully.";
                    result['id'] = mongoResult.insertedId.toHexString();
                    res.status(200).json(result);
                });
            };
            let is_default_admin = config.general.admin_username && content.name === config.general.admin_username;
            if (content.admin === true || is_default_admin === true) {
                // only admins can create other admins,
                // or if the username is the default admin name.
                if (is_default_admin === true) {
                    is_admin = true;
                    create();
                } else if (req['_icetea'].isAuthenticated()) {
                    // check if the user is an admin
                    let me = new UserSchema();
                    me._id = req['_icetea'].user_id;
                    mongo.getOne(me, (err, me) => {
                        if (err) {
                            res.status(500).json(err);
                            return;
                        }
                        if (me && me.is_admin === true) {
                            is_admin = true;
                            create();
                        } else {
                            // cannot make an admin
                            result.message = "Only administrators can create other administrator accounts.";
                            res.status(403).json(result);
                            return;
                        }
                    });
                } else {
                    // cannot make an admin
                    result.message = "Only administrators can create other administrator accounts.";
                    res.status(403).json(result);
                    return;
                }
            } else {
                create();
            }
        });
    }

    static getUser(req, res): void {
        // get a user
        if (!req.params.id) {
            // no name parameter
            res.status(400).end();
            return;
        }
        let id = this.parseUserId(req, res, "id");
        if (!id) {
            return;
        }
        if (!ObjectID.isValid(id)) {
            // not a valid ObjectID, 404 (Not Found).
            res.status(404).end();
            return;
        }
        let schema = new UserSchema;
        schema._id = new ObjectID(id);
        mongo.getOne(schema, (err, result) => {
            if (err) {
                // something went wrong, 500 (Server Error).
                res.status(500).json(err);
            } else if (result) {
                res.json(result);
            } else {
                // no user matches the ID, 404 (Not Found).
                res.status(404).end();
            }
        });
    }

    private static parseUserId(req, res, paramName): string {
        // if there is no param with that name, 400 (Bad Request).
        if (!req.params[paramName]) {
            res.status(400).end();
            return undefined;
        }
        let id = req.params[paramName];
        // "me" represents the logged-in user
        if (id === "me") {
            // check if there is a user, and the session isn't expired
            if (req._icetea.user_id && req._icetea.session_expired === false) {
                // switch "me" to the ID of the user
                id = req._icetea.user_id;
            } else {
                // can't use "me", 403 (Unauthorized).
                res.status(403).end();
                return undefined;
            }
        }
        // no "me", go through.
        return id;
    }
}
