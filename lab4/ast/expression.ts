import { Scope } from "../semantic";

export interface Expression {
    evaluateType(s: Scope): string;
    getIdentifiers(): string[];
}