import { Scope } from "../semantic";
import { TokenTypes } from "../token";
import { Expression } from "./expression";
import { IdentifierExpression } from "./identifierExpression";

export class AndExpression implements Expression {
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

        if (lhsType !== TokenTypes.Boolean) {
            throw new Error(`SH??: Non-boolean type in logic operator expression '${lhsType}'`);
        }

        return TokenTypes.Boolean; // Logic op
    }

    public getIdentifiers(): string[] {
        const lhsIdentifiers = this.lhs.getIdentifiers();
        const rhsIdentifiers = this.rhs.getIdentifiers();
        return lhsIdentifiers.concat(rhsIdentifiers);
    }
}
