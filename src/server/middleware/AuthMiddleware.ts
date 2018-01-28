import {default as WebServer, Middleware} from "../WebServer";
import UserSessionSchema from "../../db/schema/UserSessionSchema";
import {mongo} from "../../start";

export default class AuthMiddleware extends Middleware {
    middleware(server: WebServer): (req, res, next: () => void) => void {
        return (req, res, next) => {
            // check for the session cookies
            let icetea_session_token = req.cookies['icetea_session_token'];
            if (!icetea_session_token) {
                next();
                return;
            }
            // find the session
            let session = new UserSessionSchema();
            session.read({token: icetea_session_token});
            mongo.getOne(session, (err, result) => {
                if (err) {
                    console.error(err);
                    next();
                    return;
                }
                if (!result) {
                    // no session matches the token
                    console.log('received an unknown session token, ignoring.');
                    next();
                    return;
                }
                console.log('found session, userID=' + result.userId.toHexString());
                req._icetea['user_id'] = result.userId.toHexString();
                req._icetea['session_expired'] = false;
                if (result.isExpired()) {
                    req._icetea['session_expired'] = true;
                    next();
                    return;
                }
                // renew the token
                result.renew((err, newExpirationTimestamp) => {
                    if (err) {
                        throw err;
                    }
                    // update the session in the database
                    mongo.updateOne(result, {expirationTimestamp: newExpirationTimestamp}, (err, _) => {
                        if (err) {
                            throw err;
                        }
                        // update the cookie
                        res.cookie('icetea_session_token', session.token.toString('hex'), {
                            expires: new Date(newExpirationTimestamp)
                        });
                        next();
                    });
                });
            });
        };
    }
}
