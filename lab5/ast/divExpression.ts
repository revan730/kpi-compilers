import { Scope } from "../semantic";
import { TokenTypes } from "../token";
import { Expression } from "./expression";
import { IdentifierExpression } from "./identifierExpression";
import { InterpreterScope } from "../interpreterScope";

export class DivExpression implements Expression {
    private lhs: Expression;
    private rhs: Expression;
    constructor(lhs: Expression, rhs: Expression) {
        this.lhs = lhs;
        this.rhs = rhs;
    }

    public getLHS = () => {
        return this.lhs;
    }

    public getRHS = () => {
        return this.rhs;
    }

    public evaluateType(s: Scope): string {
        const lhsType = this.lhs.evaluateType(s);
        const rhsType = this.rhs.evaluateType(s);

        if (lhsType !== rhsType) {
            throw new Error(`SH??: Non-matching expression types '${lhsType}' and '${rhsType}'`);
        }

        if (lhsType !== TokenTypes.Integer) {
            throw new Error(`SH??: Non-integer type in integer-only operator expression '${lhsType}'`);
        }

        return lhsType; // Both are equal so whatever
    }

    public evaluateValue(s: InterpreterScope): any {
        const lhsValue = this.lhs.evaluateValue(s);
        const rhsValue = this.rhs.evaluateValue(s);

        return lhsValue / rhsValue;
    }

    public getIdentifiers(): string[] {
        const lhsIdentifiers = this.lhs.getIdentifiers();
        const rhsIdentifiers = this.rhs.getIdentifiers();
        return lhsIdentifiers.concat(rhsIdentifiers);
    }
}
