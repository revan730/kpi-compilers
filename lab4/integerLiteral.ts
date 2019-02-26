import { Expression } from "./expression";

export class IntegerLiteral implements Expression {
    private value: number;
    constructor(value: number) {
        this.value = value;
    }
    getValue = () => {
        return this.value;
    };
}