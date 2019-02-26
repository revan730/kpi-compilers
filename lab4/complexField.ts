import { Identifier } from "./identifier";

export class ComplexField {
    private type: string;
    private id : string;
    constructor(type: string, id: string) {
        this.type = type;
        this.id = id;
    }

    public getType(): string {
        return this.type;
    }

    public getId(): string {
        return this.id;
    }
}