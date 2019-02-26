import { Statement } from "./statement";
import { Expression } from "./expression";

export class IfStatement implements Statement {
    private condExp: Expression;
    private trueStm: Statement;
    private falseStm: Statement;

    constructor(condExp: Expression, trueStm: Statement, falseStm: Statement) {
        this.condExp = condExp;
        this.trueStm = trueStm;
        this.falseStm = falseStm;
    }

    public getCondExp(): Statement {
		return this.condExp;
	}
	
	public getTrueStm(): Statement {
		return this.trueStm;
	}
	
	public getFalseStm(): Statement {
		return this.falseStm;
    }
}