import { Expression } from "./expression";
import { TokenTypes } from "../token";

export class BooleanLiteral implements Expression {
    private value: boolean;

    constructor(value: boolean) {
        this.value = value;
    }

    public getValue = () => {
        return this.value;
    }

    public evaluateType(): string {
        return TokenTypes.Boolean;
    }

    public getIdentifiers(): string[] {
        return [];
    }
}
