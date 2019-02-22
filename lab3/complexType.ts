export class ComplexType {
    private id: string;
    private fields: ComplexType[];

    constructor(id: string, fields: ComplexType[]) {
        this.id = id;
        this.fields = fields;
    }

    public getId(): string {
        return this.id;
    }

    public getFields(): ComplexType[] {
        return this.fields;
    }
}