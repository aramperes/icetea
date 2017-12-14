import Schema from "./Schema";

const bcrypt = require('bcryptjs');

export default class UserSchema implements Schema {
    readonly schema_name: string = "user";
    public name: string;
    public email: string;
    private password_hash: string;

    set_password(password: string): void {
        this.password_hash = bcrypt.hashSync(password, 10);
    }

    password_match(password: string): boolean {
        return bcrypt.compareSync(password, this.password_hash);
    }

    toJSON() {
        let copy = (<any>Object).assign({}, this);
        delete copy.password_hash;
        return copy;
    }
}
