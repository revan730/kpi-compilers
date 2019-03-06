import { Expression } from "./expression";
import { Identifier } from "./identifier";
import { Statement } from "./statement";

export interface FieldAssignment {
    field: string;
    assignment: Expression;
}

export class ComplexAssignStatement implements Statement {
    private id: Identifier;
    private values: FieldAssignment[];

    constructor(id: Identifier, values: FieldAssignment[]) {
        this.id = id;
        this.values = values;
    }

    public getId(): Identifier {
		return this.id;
	}
	
	public getValues(): FieldAssignment[] {
		return this.values;
	}
}