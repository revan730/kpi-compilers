import { TokenTypes } from "../token";
import { Expression } from "./expression";
import { InterpreterScope } from "../interpreterScope";

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

    public evaluateValue(s: InterpreterScope): any {
        return this.value;
    }

    public getIdentifiers(): string[] {
        return [];
    }
}