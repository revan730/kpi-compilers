import { Expression } from "./expression";

export class NegativeExpression implements Expression {
    private value: Expression;
    constructor(value: Expression) {
        this.value = value;
    }
    getValue = () => {
        return this.value;
    };
}