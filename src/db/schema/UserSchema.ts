import Schema from "./Schema";

const bcrypt = require('bcryptjs');

export default class UserSchema extends Schema {
    readonly schema_name: string = "user";
    public name: string = undefined;
    public email: string = undefined;
    private password_hash: string = undefined;

    set_password(password: string): void {
        this.password_hash = bcrypt.hashSync(password, 10);
    }

    password_match(password: string): boolean {
        return bcrypt.compareSync(password, this.password_hash);
    }

    public toJSON() {
        let o = super.toJSON();
        delete o['password_hash'];
        return o;
    }
}
