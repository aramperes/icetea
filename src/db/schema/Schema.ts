import {ObjectID} from "bson";

export default abstract class Schema {
    schema_name: string;
    _id: ObjectID;

    public writePublic(o: object): void {
        o["_id"] = this._id;
    }

    public write(o: object): void {
        o["_id"] = this._id;
    }

    public read(o: object): void {
        if (o["_id"]) {
            this._id = o["_id"];
        }
    }

    public toJSON(): object {
        let result = {};
        this.writePublic(result);
        return result;
    }

    public abstract createInstance(): Schema;
}
