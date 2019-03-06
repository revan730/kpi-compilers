import { Statement } from "./statement";
import { Expression } from "./expression";

export class WhileStatement implements Statement {
    private condExp: Expression;
    private loopStm: Statement[];

    constructor(condExp: Expression,  loopStm: Statement[]) {
        this.condExp = condExp;
        this.loopStm = loopStm;
    }

    public getCondExp(): Expression {
		return this.condExp;
	}
	
	public getLoopStm(): Statement[] {
		return this.loopStm;
	}
}