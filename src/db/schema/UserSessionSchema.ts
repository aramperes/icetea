import Schema from "./Schema";
import {ObjectID} from "bson";
import UserSchema from "./UserSchema";
import * as crypto from "crypto";

export default class UserSessionSchema extends Schema {
    // session lifetime (15 weeks) in millis.
    private static readonly SESSION_LIFETIME: number = 15 * 24 * 3600 * 1000;
    // token length, in bits
    private static readonly TOKEN_LENGTH: number = 128;

    public readonly schema_name: string = "user_session";

    public userId: ObjectID = undefined;
    public token: Buffer = undefined;
    public expirationTimestamp: number = undefined;

    renew(callback: (err: Error, newExpirationTimestamp: number) => void): void {
        if (this.isExpired()) {
            callback(Error("Session is expired."), undefined);
            return;
        }
        this.expirationTimestamp = Date.now() + UserSessionSchema.SESSION_LIFETIME;
        callback(undefined, this.expirationTimestamp);
    }

    isExpired(): boolean {
        if (!this.expirationTimestamp) {
            return true;
        }
        return Date.now() > this.expirationTimestamp;
    }

    public static createSession(user: UserSchema): UserSessionSchema {
        if (!user) {
            return undefined;
        }
        let token = crypto.randomBytes(128);
        let expirationTimestamp = Date.now() + this.SESSION_LIFETIME;
        let session = new UserSessionSchema();
        session.token = token;
        session.expirationTimestamp = expirationTimestamp;
        session.userId = user._id;
        return session;
    }

    // Serialization methods
    writePublic(o: object): void {
        super.writePublic(o);
        o["expirationTimestamp"] = this.expirationTimestamp;
    }

    write(o: object): void {
        super.write(o);
        o["userId"] = this.userId;
        o["token"] = this.token.toString('hex');
        o["expirationTimestamp"] = this.expirationTimestamp;
    }

    read(o: object): void {
        super.read(o);
        this.userId = o["userId"];
        if (o["token"]) {
            this.token = Buffer.from(o["token"], 'hex');
        }
        this.expirationTimestamp = o["expirationTimestamp"];
    }

    createInstance(): Schema {
        return new UserSessionSchema();
    }
}
