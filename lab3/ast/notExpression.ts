import { Expression } from "./expression";

export class NotExpression implements Expression {
    private value: Expression;
    constructor(value: Expression) {
        this.value = value;
    }
    getValue = () => {
        return this.value;
    };
}