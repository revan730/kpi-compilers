import { Statement } from "./statement";
import { Expression } from "./expression";

export class ReturnStatement implements Statement {
    private value: Expression;

    constructor(value: Expression) {
        this.value = value;
    }
	
	public getValue(): Expression {
		return this.value;
	}
}