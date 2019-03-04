import { Expression } from "./expression";

export class Identifier implements Expression {
    private value: string;
    constructor(value: string) {
        this.value = value;
    }

    public evaluateType(s: import("../semantic").Scope): string {
        throw new Error("Method not implemented.");
    }

    public getIdentifiers(): string[] {
        throw new Error("Method not implemented.");
    }

    public getValue = () => {
        return this.value;
    }
}
