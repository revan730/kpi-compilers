import { Expression } from "./expression";
import { InterpreterScope } from "../interpreterScope";
import { Scope } from "../semantic";

export class Identifier implements Expression {
    private value: string;
    constructor(value: string) {
        this.value = value;
    }

    public evaluateValue(s: InterpreterScope): any {
        throw new Error("Method not implemented.");
    }

    public evaluateType(s: Scope): string {
        throw new Error("Method not implemented.");
    }

    public getIdentifiers(): string[] {
        throw new Error("Method not implemented.");
    }

    public getValue = () => {
        return this.value;
    }
}
