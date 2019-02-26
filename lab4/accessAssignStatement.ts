import { Statement } from "./statement";
import { Expression } from "./expression";
import { Identifier } from "./identifier";

export interface AccessFieldAssignment {
    complexVar: Identifier;
    field: string;
    assignment: Expression;
}

// Assignment to complex type field using dot operator
// ex. myTypeVar.fieldA = 15;
export class AccessAssignStatement implements Statement {
    private complexVar: string;
    private field: string;
    private assignment: Expression;

    constructor(complexVar: string, field: string, assignment: Expression) {
        this.complexVar = complexVar;
        this.field = field;
        this.assignment = assignment;
    }

    public getComplexId(): string {
		return this.complexVar;
    }
    
    public getFieldId(): string {
        return this.field;
    }
	
	public getValue(): Expression {
		return this.assignment;
	}
}