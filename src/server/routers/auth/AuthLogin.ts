import UserSchema from "../../../db/schema/UserSchema";
import {mongo} from "../../../start";
import UserSessionSchema from "../../../db/schema/UserSessionSchema";
import AuthMiddleware from "../../middleware/AuthMiddleware";
import {Response} from "express";

export default class AuthLogin {
    private constructor() {
    }

    static executeLogin(req, res: Response, callback: (errMessage?: string, errCode?: number) => void): void {
        // check if we're already logged in
        if (req._icetea.user_id && req._icetea.session_expired === false) {
            // already logged in, do nothing.
            callback();
            return;
        }

        let content = req.body;
        let result = {
            success: false,
            message: "Content is invalid."
        };
        const required_fields = {
            'username': 'string',
            'password': 'string'
        };

        // validate input
        if (!content || typeof content != "object") {
            callback(result.message, 400);
            return;
        }

        for (let field in required_fields) {
            if (!(field in content)) {
                result.message = "Required field '" + field + "' is missing.";
                callback(result.message, 400);
                return;
            }
            if (typeof content[field] != required_fields[field]) {
                result.message = "Field '" + field + "' is of type " + (typeof content[field]) +
                    " (" + JSON.stringify(content[field]) + "), expected " + required_fields[field];
                callback(result.message, 400);
                return;
            }
        }

        result.message = "Unknown username/password combination.";
        // find user
        let schema = new UserSchema;
        schema.name = content.username;
        mongo.getOne(schema, (err, user) => {
            if (err) {
                callback(err.toString(), 500);
                return;
            }
            if (!user) {
                callback(result.message, 403);
                return;
            }
            if (!user.password_match(content.password)) {
                callback(result.message, 403);
                return;
            }
            // user and password correct, create session
            let session = UserSessionSchema.createSession(user);
            // put the session in the database
            mongo.insertOne(session, (err, result) => {
                if (err) {
                    callback(err.toString(), 500);
                    return;
                }
                // set the cookie
                res.cookie(AuthMiddleware.COOKIE_SESSION_ID, session.token.toString('hex'), {
                    expires: new Date(session.expirationTimestamp),
                    httpOnly: true
                });
                callback();
            });
        });
    }
}
