import { Scope } from "../semantic";
import { Expression } from "./expression";
import { Statement } from "./statement";

export class ReturnStatement implements Statement {
    private value: Expression;

    constructor(value: Expression) {
        this.value = value;
    }

    public getValue(): Expression {
        return this.value;
    }

    public evaluateType(s: Scope): string {
        return this.value.evaluateType(s);
    }
}
