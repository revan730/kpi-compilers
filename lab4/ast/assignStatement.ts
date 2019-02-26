import { Statement } from "./statement";
import { Expression } from "./expression";
import { Identifier } from "./identifier";

export class AssignStatement implements Statement {
    private id: Identifier;
    private value: Expression;

    constructor(id: Identifier, value: Expression) {
        this.id = id;
        this.value = value;
    }

    public getId(): Identifier {
		return this.id;
	}
	
	public getValue(): Expression {
		return this.value;
	}
}