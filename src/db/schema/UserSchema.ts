import Schema from "./Schema";

const bcrypt = require('bcryptjs');

export default class UserSchema implements Schema {
  readonly schema_name: string = "user";
  public name: string;
  public email: string;
  private password_hash: string;

  set_password(password: string): void {
    var hash = bcrypt.hashSync(password, 10);
    this.password_hash = hash;
  }

  password_match(password: string): boolean {
    return bcrypt.compareSync(password, this.password_hash);
  }

  toJSON() {
    var copy = Object.assign({}, this);
    delete copy.password_hash;
    return copy;
  }
}
