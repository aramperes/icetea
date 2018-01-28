import Schema from "./Schema";

const bcrypt = require('bcryptjs');

export default class UserSchema extends Schema {
    readonly schema_name: string = "user";

    public name: string = undefined;
    public email: string = undefined;
    private password_hash: string = undefined;

    set_password(password: string): void {
        if (!password) {
            return;
        }
        this.password_hash = bcrypt.hashSync(password, 10);
    }

    password_match(password: string): boolean {
        if (!password) {
            return false;
        }
        return bcrypt.compareSync(password, this.password_hash);
    }

    writePublic(o: object): void {
        super.writePublic(o);
        o["name"] = this.name;
        o["email"] = this.email;
    }

    write(o: object): void {
        super.write(o);
        this.writePublic(o);
        o["password_hash"] = this.password_hash;
    }

    read(o: object): void {
        super.read(o);
        this.name = o["name"];
        this.email = o["email"];
        this.password_hash = o["password_hash"];
    }

    createInstance(): Schema {
        return new UserSchema();
    }
}
