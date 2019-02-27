import { Expression } from "./expression";
import { Scope } from "../semantic";

export class FieldAccessExpression implements Expression {
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

    evaluateType(s: Scope): string {
        const complexType = this.lhs.evaluateType(s);
        const fieldType = this.rhs.evaluateType(s);
        return s.analyzer.findComplexFieldDeclaration(complexType, fieldType).getType();
    }
}