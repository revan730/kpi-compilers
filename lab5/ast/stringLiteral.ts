import { Expression } from "./expression";
import { TokenTypes } from "../token";
import { InterpreterScope } from "../interpreterScope";

export class StringLiteral implements Expression {
    private value: string;

    constructor(value: string) {
        this.value = value;
    }

    public getValue = () => {
        return this.value;
    }

    public evaluateType(): string {
        return TokenTypes.String;
    }

    public evaluateValue(s: InterpreterScope): any {
        return this.getValue();
    }

    public getIdentifiers(): string[] {
        return [];
    }
}