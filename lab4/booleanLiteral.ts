import { Expression } from "./expression";

export class BooleanLiteral implements Expression {
    private value: boolean;
    constructor(value: boolean) {
        this.value = value;
    }
    getValue = () => {
        return this.value;
    };
}