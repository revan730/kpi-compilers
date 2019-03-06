import { Scope } from "../semantic";
import { TokenTypes } from "../token";
import { Expression } from "./expression";
import { InterpreterScope } from "../interpreterScope";

export class NegativeExpression implements Expression {
    private value: Expression;

    constructor(value: Expression) {
        this.value = value;
    }

    public getValue = () => {
        return this.value;
    }

    public evaluateType(s: Scope): string {
        const type = this.value.evaluateType(s);

        if (type !== TokenTypes.Integer) {
            throw new Error(`SH??: Non-integer type in integer-only operator expression '${type}'`);
        }

        return TokenTypes.Integer;
    }

    public evaluateValue(s: InterpreterScope): any {
        const value = this.value.evaluateValue(s);

        return -value;
    }

    public getIdentifiers(): string[] {
        return this.value.getIdentifiers();
    }
}
