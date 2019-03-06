import { Expression } from "./expression";
import { Scope } from "../semantic";
import { VarDeclaration } from "./varDeclaration";
import { IdentifierExpression } from "./identifierExpression";
import { InterpreterScope } from "../interpreterScope";

export class FieldAccessExpression implements Expression {
    private lhs: IdentifierExpression;
    private rhs: IdentifierExpression;

    constructor(lhs: IdentifierExpression, rhs: IdentifierExpression) {
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
        const complexType = this.lhs.getValue();
        const fieldType = this.rhs.getValue();
        return s.analyzer.findComplexFieldDeclaration(complexType, fieldType, s).getType();
    }

    public evaluateValue(s: InterpreterScope): any {
        const complexId = this.lhs.getValue();
        const fieldId = this.rhs.getValue();
        const complexObject = s.interpreter.getVar(complexId, s).getValue();
        return complexObject[fieldId];
    }

    public getIdentifiers(): string[] {
        return [this.lhs.getValue(), this.rhs.getValue()];
    }
}