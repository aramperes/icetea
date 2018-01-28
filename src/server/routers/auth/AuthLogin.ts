import UserSchema from "../../../db/schema/UserSchema";
import {mongo} from "../../../start";
import UserSessionSchema from "../../../db/schema/UserSessionSchema";

export default class AuthLogin {
    private constructor() {
    }

    static executeLogin(req, res): void {
        // check if we're already logged in
        if (req._icetea.user_id && req._icetea.session_expired === false) {
            // already logged in, do nothing.
            res.status(200).json({success: true});
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
            res.status(400).json(result);
            return;
        }
        console.log(content);

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

        result.message = "Unknown username/password combination.";
        // find user
        let schema = new UserSchema;
        schema.name = content.username;
        mongo.getOne(schema, (err, user) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            if (!user) {
                res.status(403).json(result);
                return;
            }
            if (!user.password_match(content.password)) {
                res.status(403).json(result);
                return;
            }
            // user and password correct, create session
            let session = UserSessionSchema.createSession(user);
            // put the session in the database
            mongo.insertOne(session, (err, result) => {
                if (err) {
                    res.status(500).json(err);
                    return;
                }
                // set the cookie
                res.cookie('icetea_session_token', session.token.toString('hex'), {
                    expires: new Date(session.expirationTimestamp)
                });
                res.status(200).json({success: true});
            });
        });
    }
}
