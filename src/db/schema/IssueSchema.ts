import Schema from "./Schema";
import UserSchema from "./UserSchema";

export default class IssueSchema extends Schema {
    readonly schema_name: string = "issue";

    public key: string = undefined;
    public summary: string = undefined;
    public description: string = undefined;
    public author: UserSchema = undefined;


    writePublic(o: object): void {
        super.writePublic(o);
        this.write(o);
    }

    write(o: object): void {
        super.write(o);
        o["key"] = this.key;
        o["summary"] = this.summary;
        o["description"] = this.description;
        o["author"] = this.author;
    }

    read(o: object): void {
        super.read(o);
        this.key = o["key"];
        this.summary = o["summary"];
        this.description = o["description"];
        this.author = o["author"];
    }

    createInstance(): Schema {
        return new IssueSchema();
    }
}