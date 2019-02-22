import { Expression } from "./expression";

export class RuneLiteral implements Expression {
    private value: string;
    constructor(value: string) {
        this.value = value;
    }
    getValue = () => {
        return this.value;
    };
}