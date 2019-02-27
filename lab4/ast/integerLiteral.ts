import { TokenTypes } from "../token";
import { Expression } from "./expression";

export class IntegerLiteral implements Expression {
    private value: number;

    constructor(value: number) {
        this.value = value;
    }

    public getValue = () => {
        return this.value;
    }

    public evaluateType(): string {
        return TokenTypes.Integer;
    }
}