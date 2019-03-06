import { Scope } from "../semantic";
import { TokenTypes } from "../token";
import { Expression } from "./expression";
import { InterpreterScope } from "../interpreterScope";

export class PlusExpression implements Expression {
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

        if (lhsType !== TokenTypes.Integer && lhsType !== TokenTypes.String) {
            throw new Error(`SH??: Plus op is only appliable to integer or string types, got '${lhsType}'`);
        }

        return TokenTypes.Integer; // Arithmetic op
    }

    public evaluateValue(s: InterpreterScope): any {
        const lhsValue = this.lhs.evaluateValue(s);
        const rhsValue = this.rhs.evaluateValue(s);

        return lhsValue + rhsValue;
    }

    public getIdentifiers(): string[] {
        const lhsIdentifiers = this.lhs.getIdentifiers();
        const rhsIdentifiers = this.rhs.getIdentifiers();
        return lhsIdentifiers.concat(rhsIdentifiers);
    }
}
