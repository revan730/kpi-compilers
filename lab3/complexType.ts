import { ComplexField } from "./complexField";

export class ComplexType {
    private id: string;
    private fields: ComplexField[];

    constructor(id: string, fields: ComplexField[]) {
        this.id = id;
        this.fields = fields;
    }

    public getId(): string {
        return this.id;
    }

    public getFields(): ComplexField[] {
        return this.fields;
    }
}