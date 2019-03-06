import { Scope } from "../semantic";
import { TokenTypes } from "../token";
import { Expression } from "./expression";
import { InterpreterScope } from "../interpreterScope";

export class NotExpression implements Expression {
    private value: Expression;

    constructor(value: Expression) {
        this.value = value;
    }

    public getValue = () => {
        return this.value;
    }

    public evaluateType(s: Scope): string {
        const type = this.value.evaluateType(s);

        if (type !== TokenTypes.Boolean) {
            throw new Error(`SH??: Non-boolean type in boolean-only operator expression '${type}'`);
        }

        return TokenTypes.Boolean; // Logic op
    }

    public evaluateValue(s: InterpreterScope): any {
        const value = this.value.evaluateValue(s);

        return !value;
    }

    public getIdentifiers(): string[] {
        return this.getIdentifiers();
    }
}
