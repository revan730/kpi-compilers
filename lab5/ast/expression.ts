import { Scope } from "../semantic";
import { InterpreterScope } from "../interpreterScope";

export interface Expression {
    evaluateType(s: Scope): string;
    evaluateValue(s: InterpreterScope): any;
    getIdentifiers(): string[];
}
