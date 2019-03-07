import { Scope } from "../semantic";
import { Expression } from "./expression";
import { Statement } from "./statement";
import { InterpreterScope } from "../interpreterScope";

export class ReturnStatement implements Statement {
    private value: Expression;

    constructor(value: Expression) {
        this.value = value;
    }

    public getValue(): Expression {
        return this.value;
    }

    public evaluateType(s: Scope): string {
        if (!this.value) {
            return null;
        }
        return this.value.evaluateType(s);
    }

    public evaluateValue(s: InterpreterScope): any {
        if (!this.value) {
            return "NIL";
        }
        return this.value.evaluateValue(s);
    }
}
