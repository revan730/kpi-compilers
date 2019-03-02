import { Scope } from "../semantic";
import { Expression } from "./expression";

export class IdentifierExpression implements Expression {
    private value: string;

    constructor(value: string) {
        this.value = value;
    }

    public getValue = () => {
        return this.value;
    }

    public evaluateType(s: Scope): string {
        // Expression type is of variable with this id
        return s.analyzer.findVariableDeclaration(this.value, s).getType();
    }

    public getIdentifiers(): string[] {
        return [this.value];
    }
}
