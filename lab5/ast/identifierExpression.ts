import { Scope } from "../semantic";
import { Expression } from "./expression";
import { InterpreterScope } from "../interpreterScope";

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

    public evaluateValue(s: InterpreterScope): any {
        return s.interpreter.getVar(this.value, s).getValue();
    }

    public getIdentifiers(): string[] {
        return [this.value];
    }
}
