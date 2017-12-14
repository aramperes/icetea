export default abstract class Schema {
    schema_name: string;

    public toJSON(): object {
        let copy = (<any>Object).assign({}, this);
        delete copy.schema_name;
        return copy;
    }

    public read(o: object): Schema {
        let copy = (<any>Object).assign({}, this);
        copy = (<any>Object).assign(copy, Object.getPrototypeOf(this));
        const properties = Object.getOwnPropertyNames(copy);
        for (let key of Object.keys(o)) {
            if (properties.indexOf(key) !== -1) {
                copy[key] = o[key];
            }
        }
        return <Schema>copy;
    }
}
