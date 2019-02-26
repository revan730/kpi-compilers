import { Expression } from "./expression";

export class IdentifierExpression implements Expression {
    private value: string;
    constructor(value: string) {
        this.value = value;
    }
    getValue = () => {
        return this.value;
    };
}